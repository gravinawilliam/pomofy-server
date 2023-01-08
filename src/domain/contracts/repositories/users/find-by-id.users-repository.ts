import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

import { Id } from '@value-objects/id.value-object';

export namespace FindByIdUsersRepositoryDTO {
  export type Parameters = Readonly<{ id: Id }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = {
    user?: Pick<User, 'id'>;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindByIdUsersRepository {
  findById(parameters: FindByIdUsersRepositoryDTO.Parameters): FindByIdUsersRepositoryDTO.Result;
}
