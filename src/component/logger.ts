import os from 'os';

import winston from 'winston';
import { TransformableInfo } from 'logform';

import config from '../config/environment';

const appName = module.exports.name;
const container = new winston.Container();

/**
 * Console Log Transport
 */
const ConsoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.prettyPrint(),
        // winston.format.colorize(),
        // winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`),
        winston.format.json(),
    ),
});

const customLogFormat = winston.format((info: TransformableInfo): TransformableInfo | boolean => {
    info.serverInfo = {
        appName,
        name: os.hostname(),
        platform: os.platform(),
        env: config.env,
    };

    return info;
});

export const LoggerManager = {
    initialization(serviceName: string) {
        return container.add(serviceName, {
            level: 'info',
            format: winston.format.combine(customLogFormat()),
            transports: [ ConsoleTransport ],
            exceptionHandlers: [ ConsoleTransport ],
        });
    },

    getLogger(serviceName = 'common') {
        return this.initialization(serviceName);
    },
};
