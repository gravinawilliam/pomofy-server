import validator from 'email-validator';

import { IValidateEmailProvider, ValidateEmailProviderDTO } from '@contracts/providers/email/validate.email-provider';
import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';

import { EmailProviderMethods, ProviderError, ProviderNames } from '@errors/_shared/provider.error';
import { InvalidEmailError, InvalidEmailMotive } from '@errors/value-objects/invalid-email.error';

import { failure, success } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';

export class EmailValidatorProvider implements IValidateEmailProvider {
  constructor(private readonly loggerProvider: ISendErrorLoggerProvider) {}

  public validate(parameters: ValidateEmailProviderDTO.Parameters): ValidateEmailProviderDTO.Result {
    try {
      const isValid = validator.validate(parameters.email);

      if (isValid === false) return failure(new InvalidEmailError({ motive: InvalidEmailMotive.IS_INVALID }));

      return success({ emailValidated: new Email({ email: parameters.email }) });
    } catch (error: any) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProviderNames.EMAIL,
          method: EmailProviderMethods.VALIDATE
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
