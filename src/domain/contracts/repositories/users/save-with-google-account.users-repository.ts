import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';
import { Username } from '@value-objects/username.value-object';

export namespace SaveWithGoogleAccountUsersRepositoryDTO {
  export type Parameters = Readonly<{
    username: Username;
    email: Email;
    googleAccountId: string;
    isEmailValidated: boolean;
  }>;

  export type ResultError = RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<{ user: Pick<User, 'id'> }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveWithGoogleAccountUsersRepository {
  saveWithGoogleAccount(
    parameters: SaveWithGoogleAccountUsersRepositoryDTO.Parameters
  ): SaveWithGoogleAccountUsersRepositoryDTO.Result;
}
