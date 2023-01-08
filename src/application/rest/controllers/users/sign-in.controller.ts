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
import { SignInUseCaseDTO } from '@use-cases/users/sign-in.use-case';

export class SignInController extends Controller<SignInControllerDTO.Parameters, SignInControllerDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider & ISendErrorLoggerProvider,
    private readonly signInUseCase: UseCase<SignInUseCaseDTO.Parameters, SignInUseCaseDTO.Result>
  ) {
    super(loggerProvider);
  }

  protected buildValidators(): IValidator[] {
    return [];
  }

  protected async performOperation(parameters: SignInControllerDTO.Parameters): SignInControllerDTO.Result {
    const resultSignIn = await this.signInUseCase.execute({
      facebookAccessToken: parameters.body.facebook_access_token,
      googleAccessToken: parameters.body.google_access_token,
      credentials:
        parameters.body.credentials === undefined
          ? undefined
          : {
              password: parameters.body.credentials.password,
              usernameOrEmail: parameters.body.credentials.username_or_email
            }
    });
    if (resultSignIn.isFailure()) return failure(resultSignIn.value);
    const { accessToken } = resultSignIn.value;
    return success({ data: { access_token: accessToken }, status: StatusSuccess.DONE });
  }
}

export namespace SignInControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<{
      credentials?: {
        username_or_email: string;
        password: string;
      };
      facebook_access_token?: string;
      google_access_token?: string;
    }>
  >;

  type ResultError = SignInUseCaseDTO.ResultError;
  type ResultSuccess = Readonly<ResponseSuccess<{ access_token: string }>>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
