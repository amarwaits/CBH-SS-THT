import Express from 'express';
import { useExpressServer } from 'routing-controllers';
import gracefulShutdown from 'http-graceful-shutdown';

import Logger from './logger';
import { ObjectUtils } from './utils';
import * as controllers from './controllers';
import * as middlewares from './middlewares';

process.on('uncaughtException', Logger.error);
process.on('unhandledRejection', Logger.error);

const start = async () => {
  const app: Express.Application = Express()

  useExpressServer(app, {
    controllers: <Function[]>ObjectUtils.getObjectValues(controllers),
    defaultErrorHandler: false,
    defaults: {
      nullResultCode: 404,
      paramOptions: {
        required: true,
      },
      undefinedResultCode: 404,
    },
    middlewares: <Function[]>ObjectUtils.getObjectValues(middlewares),
    routePrefix: '/api',
  });

  const server = app.listen(8080, () => {
    Logger.info(`Server up and running on port 8080`);
  });

  gracefulShutdown(server);
};

start();