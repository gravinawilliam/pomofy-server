import { ISendEmailProvider, SendEmailProviderDTO } from '@contracts/providers/email/send.email-provider';
import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';

import { failure, success } from '@shared/utils/either.util';

import { EmailProviderMethods, ProviderError, ProviderNames } from '@domain/entities/errors/_shared/provider.error';

export class TaillowEmailProvider implements ISendEmailProvider {
  constructor(private readonly loggerProvider: ISendErrorLoggerProvider) {}

  public async send(parameters: SendEmailProviderDTO.Parameters): SendEmailProviderDTO.Result {
    try {
      await console.log('send', parameters);
      return success(undefined);
    } catch (error: any) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProviderNames.EMAIL,
          method: EmailProviderMethods.SEND
        }
      });

      this.loggerProvider.error({
        message: `${errorProvider.message} Error in lib email-validator.`,
        value: error
      });

      return failure(errorProvider);
    }
  }
}
