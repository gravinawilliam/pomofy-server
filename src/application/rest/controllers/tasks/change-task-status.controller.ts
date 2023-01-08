import { Controller, HttpRequest, ResponseSuccess, StatusSuccess } from '@application/rest/_shared/controller.util';

import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { InvalidTaskStatusError } from '@errors/models/tasks/invalid-task-status.error';

import { Task, TaskStatus } from '@models/task.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';
import { ChangeTaskStatusUseCaseDTO } from '@use-cases/tasks/change-task-status.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

export class ChangeTaskStatusController extends Controller<
  ChangeTaskStatusControllerDTO.Parameters,
  ChangeTaskStatusControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider & ISendErrorLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.Result
    >,
    private readonly changeTaskStatusUseCase: UseCase<
      ChangeTaskStatusUseCaseDTO.Parameters,
      ChangeTaskStatusUseCaseDTO.Result
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: ChangeTaskStatusControllerDTO.Parameters
  ): ChangeTaskStatusControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const taskStatus: TaskStatus = Task.selectTaskStatus(parameters.body.task.status);
    if (taskStatus === TaskStatus.NOT_STATUS) {
      return failure(new InvalidTaskStatusError({ taskStatus: parameters.body.task.status }));
    }

    const resultChangeTaskStatus = await this.changeTaskStatusUseCase.execute({
      task: { id: parameters.body.task.id, status: taskStatus },
      user
    });
    if (resultChangeTaskStatus.isFailure()) return failure(resultChangeTaskStatus.value);

    return success({
      data: {},
      status: StatusSuccess.CREATED
    });
  }
}

export namespace ChangeTaskStatusControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<{
      task: {
        id: string;
        status: string;
      };
    }>
  >;

  type ResultError =
    | ChangeTaskStatusUseCaseDTO.ResultError
    | InvalidTaskStatusError
    | VerifyAccessTokenUseCaseDTO.ResultError;
  type ResultSuccess = Readonly<ResponseSuccess>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
