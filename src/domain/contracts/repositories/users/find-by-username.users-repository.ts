import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

import { Username } from '@value-objects/username.value-object';

export namespace FindByUsernameUsersRepositoryDTO {
  export type Parameters = Readonly<{
    username: Username;
  }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = {
    user?: Pick<User, 'id' | 'password'>;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindByUsernameUsersRepository {
  findByUsername(parameters: FindByUsernameUsersRepositoryDTO.Parameters): FindByUsernameUsersRepositoryDTO.Result;
}
