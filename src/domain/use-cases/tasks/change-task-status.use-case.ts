import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { IFindByIdTasksRepository } from '@contracts/repositories/tasks/find-by-id.tasks-repository';
import { IUpdateTasksRepository } from '@contracts/repositories/tasks/update.tasks-repository';

import { RepositoryError } from '@errors/_shared/repository.error';
import { NotFoundTaskError } from '@errors/models/tasks/not-found-task.error';

import { TaskStatus } from '@models/task.model';
import { User } from '@models/user.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';

import { Id } from '@value-objects/id.value-object';

export class ChangeTaskStatusUseCase extends UseCase<
  ChangeTaskStatusUseCaseDTO.Parameters,
  ChangeTaskStatusUseCaseDTO.Result
> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider,
    private readonly tasksRepository: IUpdateTasksRepository & IFindByIdTasksRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ChangeTaskStatusUseCaseDTO.Parameters): ChangeTaskStatusUseCaseDTO.Result {
    const taskId = new Id({ id: parameters.task.id });
    const resultFindById = await this.tasksRepository.findById({
      task: {
        id: taskId,
        user: { id: parameters.user.id }
      }
    });
    if (resultFindById.isFailure()) return failure(resultFindById.value);
    const { task } = resultFindById.value;
    if (task === undefined) return failure(new NotFoundTaskError({ task: { id: taskId } }));

    const resultUpdateTask = await this.tasksRepository.update({
      task: {
        status: parameters.task.status,
        id: taskId
      }
    });
    if (resultUpdateTask.isFailure()) return failure(resultUpdateTask.value);

    return success(undefined);
  }
}

export namespace ChangeTaskStatusUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    task: {
      id: string;
      status: TaskStatus;
    };
  }>;

  export type ResultError = NotFoundTaskError | RepositoryError;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
