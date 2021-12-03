import { Request, Response } from 'express';

export function main(_: Request, res: Response) {
  try {
    res.status(200).send('Hello World');
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}
