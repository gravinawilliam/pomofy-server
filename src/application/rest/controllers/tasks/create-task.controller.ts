import {
  Controller,
  HttpRequest,
  IValidator,
  ResponseSuccess,
  StatusSuccess
} from '@application/rest/_shared/controller.util';

import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';
import { CreateTaskUseCaseDTO } from '@use-cases/tasks/create-task.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

export class CreateTaskController extends Controller<CreateTaskControllerDTO.Parameters, CreateTaskControllerDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider & ISendErrorLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.Result
    >,
    private readonly createTaskUseCase: UseCase<CreateTaskUseCaseDTO.Parameters, CreateTaskUseCaseDTO.Result>
  ) {
    super(loggerProvider);
  }

  protected buildValidators(): IValidator[] {
    return [];
  }

  protected async performOperation(parameters: CreateTaskControllerDTO.Parameters): CreateTaskControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultCreateTask = await this.createTaskUseCase.execute({
      task: { name: parameters.body.name },
      user
    });
    if (resultCreateTask.isFailure()) return failure(resultCreateTask.value);
    const { task } = resultCreateTask.value;

    return success({
      data: {
        task: { id: task.id.value }
      },
      status: StatusSuccess.CREATED
    });
  }
}

export namespace CreateTaskControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<{
      name: string;
    }>
  >;

  type ResultError = CreateTaskUseCaseDTO.ResultError | VerifyAccessTokenUseCaseDTO.ResultError;
  type ResultSuccess = Readonly<ResponseSuccess<{ task: { id: string } }>>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
