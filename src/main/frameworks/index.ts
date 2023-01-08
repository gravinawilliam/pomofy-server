import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { NestjsFramework } from './nestjs';

export const selectFramework = async (parameters: { logger: ISendInfoLoggerProvider }): Promise<any> => {
  const nestjs = new NestjsFramework();
  await nestjs.execute(parameters.logger);
};
