import Express from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { ERROR_MESSAGES, httpStatusCodes, TOKEN_PREFIX } from '../constants';
import { GenericResponse } from '../models';
import { MyCache } from '../cache';

@Middleware({ type: 'before' })
export class AuthenticationMiddleWare implements ExpressMiddlewareInterface {
  public async use(request: Express.Request, response: Express.Response, next: () => Promise<unknown>): Promise<unknown> {
    if (!request.headers.byPass) {
      const validToken = MyCache.has(`${TOKEN_PREFIX}${request.headers.token}`)
      if (!validToken) {
        response.status(httpStatusCodes.UNAUTHORIZED);
        response.send(new GenericResponse(ERROR_MESSAGES.INVALID_AUTH_TOKEN, httpStatusCodes.UNAUTHORIZED));
        response.end();
      } else {
        return next();
      }
    } else {
      return next();
    }
  }
}