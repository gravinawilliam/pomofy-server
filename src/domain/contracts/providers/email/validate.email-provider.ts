import { ProviderError } from '@errors/_shared/provider.error';
import { InvalidEmailError } from '@errors/value-objects/invalid-email.error';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';

export namespace ValidateEmailProviderDTO {
  export type Parameters = Readonly<{ email: string }>;

  export type ResultError = InvalidEmailError | ProviderError;
  export type ResultSuccess = Readonly<{ emailValidated: Email }>;

  export type Result = Either<ResultError, ResultSuccess>;
}

export interface IValidateEmailProvider {
  validate(parameters: ValidateEmailProviderDTO.Parameters): ValidateEmailProviderDTO.Result;
}
