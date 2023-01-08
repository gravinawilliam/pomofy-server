import { Controller, HttpRequest, ResponseSuccess, StatusSuccess } from '@application/rest/_shared/controller.util';

import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { InvalidTaskStatusError } from '@errors/models/tasks/invalid-task-status.error';

import { Task, TaskStatus } from '@models/task.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';
import { ListTasksUseCaseDTO } from '@use-cases/tasks/list-tasks.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

export class ListTasksController extends Controller<ListTasksControllerDTO.Parameters, ListTasksControllerDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider & ISendErrorLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.Result
    >,
    private readonly listTasksUseCase: UseCase<ListTasksUseCaseDTO.Parameters, ListTasksUseCaseDTO.Result>
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListTasksControllerDTO.Parameters): ListTasksControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const taskStatus: TaskStatus = Task.selectTaskStatus(parameters.query.task_status);

    if (taskStatus === TaskStatus.NOT_STATUS) {
      return failure(new InvalidTaskStatusError({ taskStatus: parameters.query.task_status }));
    }

    const resultListTasks = await this.listTasksUseCase.execute({
      task: { status: taskStatus },
      user
    });
    if (resultListTasks.isFailure()) return failure(resultListTasks.value);
    const { tasks } = resultListTasks.value;

    return success({
      data: {
        tasks: tasks.map(task => ({
          id: task.id.value,
          status: task.status,
          name: task.name
        }))
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace ListTasksControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        task_status: string;
      }
    >
  >;

  type ResultError = ListTasksUseCaseDTO.ResultError | InvalidTaskStatusError | VerifyAccessTokenUseCaseDTO.ResultError;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      tasks: {
        id: string;
        status: string;
        name: string;
      }[];
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
