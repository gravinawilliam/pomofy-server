import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';
import { Password } from '@value-objects/password.value-object';
import { Username } from '@value-objects/username.value-object';

export namespace SaveUsersRepositoryDTO {
  export type Parameters = Readonly<{
    username: Username;
    email: Email;
    password: Password;
    isEmailValidated: boolean;
  }>;

  export type ResultError = RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<{
    user: Pick<User, 'id'>;
  }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveUsersRepository {
  save(parameters: SaveUsersRepositoryDTO.Parameters): SaveUsersRepositoryDTO.Result;
}
