import { RepositoryError } from '@errors/_shared/repository.error';

import { Either } from '@shared/utils/either.util';

import { User } from '@domain/entities/models/user.model';

export namespace UpdateUsersRepositoryDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id' | 'facebookAccount' | 'googleAccount'>;
  }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IUpdateUsersRepository {
  update(parameters: UpdateUsersRepositoryDTO.Parameters): UpdateUsersRepositoryDTO.Result;
}
