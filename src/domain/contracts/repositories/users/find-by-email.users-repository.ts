import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

import { Email } from '@value-objects/email.value-object';

export namespace FindByEmailUsersRepositoryDTO {
  export type Parameters = Readonly<{ email: Email }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = {
    user?: Pick<User, 'id' | 'password' | 'facebookAccount' | 'googleAccount'>;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindByEmailUsersRepository {
  findByEmail(parameters: FindByEmailUsersRepositoryDTO.Parameters): FindByEmailUsersRepositoryDTO.Result;
}
