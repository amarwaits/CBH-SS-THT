"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const routing_controllers_1 = require("routing-controllers");
const http_graceful_shutdown_1 = (0, tslib_1.__importDefault)(require("http-graceful-shutdown"));
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
const utils_1 = require("./utils");
const controllers = (0, tslib_1.__importStar)(require("./controllers"));
const middlewares = (0, tslib_1.__importStar)(require("./middlewares"));
process.on('uncaughtException', logger_1.default.error);
process.on('unhandledRejection', logger_1.default.error);
const start = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    (0, routing_controllers_1.useExpressServer)(app, {
        controllers: utils_1.ObjectUtils.getObjectValues(controllers),
        defaultErrorHandler: false,
        defaults: {
            nullResultCode: 404,
            paramOptions: {
                required: true,
            },
            undefinedResultCode: 404,
        },
        middlewares: utils_1.ObjectUtils.getObjectValues(middlewares),
        routePrefix: '/api',
    });
    const server = app.listen(8080, () => {
        logger_1.default.info(`Server up and running on port 8080`);
    });
    (0, http_graceful_shutdown_1.default)(server);
});
start();
