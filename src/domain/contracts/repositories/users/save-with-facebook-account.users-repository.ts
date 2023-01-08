import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';

import { ProviderError } from '@domain/entities/errors/_shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/_shared/repository.error';
import { Username } from '@domain/entities/value-objects/username.value-object';

export namespace SaveWithFacebookAccountUsersRepositoryDTO {
  export type Parameters = Readonly<{
    username: Username;
    email: Email;
    facebookAccountId: string;
    isEmailValidated: boolean;
  }>;

  export type ResultError = RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<{ user: Pick<User, 'id'> }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveWithFacebookAccountUsersRepository {
  saveWithFacebookAccount(
    parameters: SaveWithFacebookAccountUsersRepositoryDTO.Parameters
  ): SaveWithFacebookAccountUsersRepositoryDTO.Result;
}
