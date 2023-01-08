import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { Task } from '@models/task.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveTasksRepositoryDTO {
  export type Parameters = Readonly<{
    task: Pick<Task, 'status' | 'user' | 'name'>;
  }>;

  export type ResultError = RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<{
    task: Pick<Task, 'id'>;
  }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveTasksRepository {
  save(parameters: SaveTasksRepositoryDTO.Parameters): SaveTasksRepositoryDTO.Result;
}
