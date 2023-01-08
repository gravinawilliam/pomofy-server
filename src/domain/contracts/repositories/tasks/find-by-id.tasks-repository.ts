import { RepositoryError } from '@errors/_shared/repository.error';

import { Task } from '@models/task.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByIdTasksRepositoryDTO {
  export type Parameters = Readonly<{
    task: Pick<Task, 'id' | 'user'>;
  }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = Readonly<{
    task?: Pick<Task, 'id' | 'name' | 'status'>;
  }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindByIdTasksRepository {
  findById(parameters: FindByIdTasksRepositoryDTO.Parameters): FindByIdTasksRepositoryDTO.Result;
}
