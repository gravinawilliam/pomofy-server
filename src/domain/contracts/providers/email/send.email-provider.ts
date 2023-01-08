import { ProviderError } from '@errors/_shared/provider.error';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';

export namespace SendEmailProviderDTO {
  export type Parameters = Readonly<{
    to: {
      email: Email;
      name: string;
    }[];
    emailTemplate: { slug: string };
    variables: { [key: string]: string };
  }>;

  export type ResultError = ProviderError;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISendEmailProvider {
  send(parameters: SendEmailProviderDTO.Parameters): SendEmailProviderDTO.Result;
}
