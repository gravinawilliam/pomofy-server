import { performance } from 'perf_hooks';

import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

export abstract class UseCase<Parameters, Response> {
  constructor(private readonly loggerProvider: ISendInfoLoggerProvider) {}

  public async execute(parameters: Parameters): Promise<Response> {
    const startTime = performance.now();
    const response = await this.performOperation(parameters);
    this.loggerProvider.info({
      message: `${this.constructor.name}.execute(${parameters}) took +${performance.now() - startTime} ms to execute!`
    });
    return response;
  }

  protected abstract performOperation(parameters: Parameters): Response;
}
