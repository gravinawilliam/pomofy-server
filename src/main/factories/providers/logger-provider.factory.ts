import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendHttpLoggerProvider } from '@contracts/providers/logger/send-http-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { WinstonLoggerProvider } from '@infrastructure/providers/logger/winston.logger-provider';

export const makeLoggerProvider = (): ISendErrorLoggerProvider & ISendInfoLoggerProvider & ISendHttpLoggerProvider =>
  new WinstonLoggerProvider({
    IS_DEVELOPMENT: true,
    LOGS_FOLDER: 'logs'
  });
