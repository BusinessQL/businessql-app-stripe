// Copyright (c) Alex Ellis 2021. All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2021. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
require('dotenv').config();
const packageJson = require('./package.json');
const express = require('express');
const app = express();
const handler = require('./function/handler').default;
const bodyParser = require('body-parser');

const defaultMaxSize = '100kb'; // body-parser default

app.disable('x-powered-by');

const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize;
const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize;

app.use(function addDefaultContentType(req, res, next) {
  // When no content-type is given, the body element is set to
  // nil, and has been a source of contention for new users.

  if (!req.headers['content-type']) {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

if (process.env.RAW_BODY === 'true') {
  app.use(bodyParser.raw({ type: '*/*', limit: rawLimit }));
} else {
  app.use(bodyParser.text({ type: 'text/*' }));
  app.use(bodyParser.json({ limit: jsonLimit }));
  app.use(bodyParser.urlencoded({ extended: true }));
}

const isArray = (a) => {
  return !!a && a.constructor === Array;
};

const isObject = (a) => {
  return !!a && a.constructor === Object;
};

class FunctionEvent {
  constructor(req) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;
  }
}

class FunctionContext {
  constructor(cb) {
    this.statusCode = 200;
    this.cb = cb;
    this.headerValues = {};
    this.cbCalled = 0;
  }

  status(statusCode) {
    if (!statusCode) {
      return this.statusCode;
    }

    this.statusCode = statusCode;
    return this;
  }

  headers(value) {
    if (!value) {
      return this.headerValues;
    }

    this.headerValues = value;
    return this;
  }

  succeed(value) {
    let err;
    this.cbCalled++;
    this.cb(err, value);
  }

  fail(value) {
    let message;
    if (this.status() == '200') {
      this.status(500);
    }

    this.cbCalled++;
    this.cb(value, message);
  }
}

const middleware = async (req, res) => {
  const cb = (err, functionResult) => {
    if (err) {
      return res
        .status(fnContext.status())
        .json({ error: err.toString ? err.toString() : err });
    }

    if (isArray(functionResult) || isObject(functionResult)) {
      res
        .set(fnContext.headers())
        .status(fnContext.status())
        .json(functionResult);
    } else {
      res
        .set(fnContext.headers())
        .status(fnContext.status())
        .send(JSON.stringify(functionResult));
    }
  };

  const fnEvent = new FunctionEvent(req);
  const fnContext = new FunctionContext(cb);

  Promise.resolve(handler(fnEvent, fnContext, cb))
    .then((res) => {
      if (!fnContext.cbCalled) {
        fnContext.succeed(res);
      }
    })
    .catch((e) => {
      cb(e);
    });
};

app.use('*', (req, res, next) => {
  res.set('x-bql-app-name', packageJson.name);
  res.set('x-bql-app-version', packageJson.version);
  next();
});
app.post('/*', middleware);
app.options('/*', middleware);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found', statusCode: 404 });
});

const port = process.env.http_port || process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`${packageJson.name}:${packageJson.version}`);
  console.log(`http://localhost:${port}`);
});
