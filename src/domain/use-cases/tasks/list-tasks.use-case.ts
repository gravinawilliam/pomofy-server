import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { IFindTasksRepository } from '@contracts/repositories/tasks/find.tasks-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidTaskNameError } from '@errors/models/tasks/invalid-task-name.error';

import { Task } from '@models/task.model';
import { User } from '@models/user.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';

export class ListTasksUseCase extends UseCase<ListTasksUseCaseDTO.Parameters, ListTasksUseCaseDTO.Result> {
  constructor(loggerProvider: ISendInfoLoggerProvider, private readonly tasksRepository: IFindTasksRepository) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListTasksUseCaseDTO.Parameters): ListTasksUseCaseDTO.Result {
    const resultFindTasks = await this.tasksRepository.find({
      task: {
        status: parameters.task.status,
        user: { id: parameters.user.id }
      }
    });
    if (resultFindTasks.isFailure()) return failure(resultFindTasks.value);
    const { tasks } = resultFindTasks.value;

    return success({ tasks });
  }
}

export namespace ListTasksUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    task: Pick<Task, 'status'>;
  }>;

  export type ResultError = InvalidTaskNameError | RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<{ tasks: Pick<Task, 'id' | 'name' | 'status'>[] }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
