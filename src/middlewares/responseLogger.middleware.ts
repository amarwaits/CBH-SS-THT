import Express from 'express'
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { UNKNOWN_ENDPOINT, httpStatusCodes } from '../constants';
import Logger from '../logger';

import { GenericResponse } from '../models';

@Middleware({ type: 'after' })
export class ResponseLoggerMiddleware implements ExpressMiddlewareInterface {
  public use(request: Express.Request, response: Express.Response): void {
    if (!response.headersSent) {
      response.status(httpStatusCodes.NOT_FOUND);
      response.send(new GenericResponse(UNKNOWN_ENDPOINT.message, UNKNOWN_ENDPOINT.statusCode));
      response.end();
    }

    const responseTime = new Date().getTime() - response.startTime.getTime();
    Logger.info(`Response took ${responseTime}ms with status code ${response.statusCode}`);
  }
}