import { RepositoryError } from '@errors/_shared/repository.error';

import { Task } from '@models/task.model';

import { Either } from '@shared/utils/either.util';

export namespace UpdateTasksRepositoryDTO {
  export type Parameters = Readonly<{
    task: Pick<Task, 'id' | 'status'>;
  }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IUpdateTasksRepository {
  update(parameters: UpdateTasksRepositoryDTO.Parameters): UpdateTasksRepositoryDTO.Result;
}
