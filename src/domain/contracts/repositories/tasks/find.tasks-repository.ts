import { RepositoryError } from '@errors/_shared/repository.error';

import { Task } from '@models/task.model';

import { Either } from '@shared/utils/either.util';

export namespace FindTasksRepositoryDTO {
  export type Parameters = Readonly<{
    task: Pick<Task, 'status' | 'user'>;
  }>;

  export type ResultError = RepositoryError;
  export type ResultSuccess = Readonly<{
    tasks: Pick<Task, 'id' | 'name' | 'status'>[];
  }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindTasksRepository {
  find(parameters: FindTasksRepositoryDTO.Parameters): FindTasksRepositoryDTO.Result;
}
