import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { ISaveTasksRepository } from '@contracts/repositories/tasks/save.tasks-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidTaskNameError } from '@errors/models/tasks/invalid-task-name.error';

import { Task, TaskStatus } from '@models/task.model';
import { User } from '@models/user.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';

export class CreateTaskUseCase extends UseCase<CreateTaskUseCaseDTO.Parameters, CreateTaskUseCaseDTO.Result> {
  constructor(loggerProvider: ISendInfoLoggerProvider, private readonly tasksRepository: ISaveTasksRepository) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateTaskUseCaseDTO.Parameters): CreateTaskUseCaseDTO.Result {
    if (parameters.task.name.trim().length === 0 || parameters.task.name.trim().length > 99) {
      return failure(new InvalidTaskNameError({ taskName: parameters.task.name }));
    }
    const resultSaveTask = await this.tasksRepository.save({
      task: {
        status: TaskStatus.PENDING,
        name: parameters.task.name.trim(),
        user: { id: parameters.user.id }
      }
    });
    if (resultSaveTask.isFailure()) return failure(resultSaveTask.value);
    return success({ task: { id: resultSaveTask.value.task.id } });
  }
}

export namespace CreateTaskUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    task: { name: string };
  }>;

  export type ResultError = InvalidTaskNameError | RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<{ task: Pick<Task, 'id'> }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
