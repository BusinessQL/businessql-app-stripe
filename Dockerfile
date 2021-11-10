FROM node:12-buster-slim as BUILD

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
RUN rm -rf node_modules
RUN npm install --production

FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.9.1 as watchdog
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:14-alpine as ship

ARG TARGETPLATFORM
ARG BUILDPLATFORM

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN apk --no-cache add curl ca-certificates \
    && addgroup -S app && adduser -S -g app app

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN chmod 777 /tmp

# USER app

# RUN mkdir -p /home/app/function

# Wrapper/boot-strapper
WORKDIR /home/app
# COPY package.json ./

COPY --from=BUILD /app/index.js ./index.js
COPY --from=BUILD /app/function ./function
COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/package.json ./package.json

# This ordering means the npm installation is cached for the outer function handler.
# RUN npm install
# RUN npm run build

# Copy outer function handler
# COPY index.js ./

# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install

# WORKDIR /home/app/function
# COPY function/*.json ./

# RUN npm i

# COPY function files and folders
# COPY function/ ./

# Run any tests that may be available
# RUN npm test

# Set correct permissions to use non root user
# WORKDIR /home/app/

ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

ENV prefix_logs="false"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]
