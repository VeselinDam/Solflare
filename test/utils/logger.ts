import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Initializes a Winston logger instance with both console and file outputs.
 *
 * This logger provides colorized console output and persistent file logging
 * in a `logs` directory at the project root.
 *
 * Behavior:
 * - Ensures the `logs` folder exists before creating the logger.
 * - Uses simple `[LEVEL]: message` formatting without timestamps for clean, readable output.
 * - Console logs are colorized based on severity (INFO, WARN, ERROR, etc.).
 * - File logs are stored in `logs/app.log`.
 *
 * Default log level: `info`
 * Supported levels (in order of severity): `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`
 *
 * Usage example:
 * ```ts
 * import logger from '../utils/logger';
 *
 * logger.info('Starting test execution');
 * logger.debug('Element located successfully');
 * logger.error('API request failed');
 * ```
 *
 * @constant
 * @type {import('winston').Logger}
 * @see https://github.com/winstonjs/winston
 */
const logDir = path.resolve('./logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
    level: 'info', // default level (info, debug, error, warn)
    format: format.combine(
        format.printf(({ level, message }) => {
            return `[${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({ filename: path.join(logDir, 'app.log') }),
    ],
});

export default logger;
