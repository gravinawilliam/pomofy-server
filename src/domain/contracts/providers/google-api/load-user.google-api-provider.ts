import { ProviderError } from '@errors/_shared/provider.error';
import { LoadUserGoogleApiError } from '@errors/providers/google-api/load-user-google-api.error';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';
import { Id } from '@value-objects/id.value-object';

export namespace LoadUserGoogleApiProviderDTO {
  export type Parameters = Readonly<{
    accessToken: string;
  }>;

  export type ResultError = ProviderError | LoadUserGoogleApiError;
  export type ResultSuccess = {
    googleAccount: {
      id: Id;
      email: Email;
      name: string;
    };
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ILoadUserGoogleApiProvider {
  loadUser(parameters: LoadUserGoogleApiProviderDTO.Parameters): LoadUserGoogleApiProviderDTO.Result;
}
