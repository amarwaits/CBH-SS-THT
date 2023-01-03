import Express from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { ERROR_MESSAGES, httpStatusCodes } from '../constants';
import { GenericResponse } from '../models';
import Logger from '../logger';

@Middleware({ type: 'before' })
export class RequestLoggerMiddleWare implements ExpressMiddlewareInterface {
  public async use(request: Express.Request, response: Express.Response, next: () => Promise<unknown>): Promise<unknown> {
    response.startTime = new Date();
    Logger.info(`Request ${request.url}`);

    // if (request.originalUrl === '/api/user/login' || request.originalUrl === '/api/salary-stat/record')
      request.headers.byPass = true

    if (!request.headers.token && !request.headers.byPass) {
      response.status(httpStatusCodes.BAD_REQUEST);
      response.send(new GenericResponse(ERROR_MESSAGES.INVALID_AUTH_TOKEN, httpStatusCodes.BAD_REQUEST));
      response.end();
    } else {
      return next();
    }
  }
}