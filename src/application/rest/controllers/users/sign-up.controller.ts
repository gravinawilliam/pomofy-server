import { Controller, HttpRequest, ResponseSuccess, StatusSuccess } from '@application/rest/_shared/controller.util';

import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@use-cases/_shared/use-case';
import { SignInUseCaseDTO } from '@use-cases/users/sign-in.use-case';
import { SignUpUseCaseDTO } from '@use-cases/users/sign-up.use-case';

export class SignUpController extends Controller<SignUpControllerDTO.Parameters, SignUpControllerDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider & ISendErrorLoggerProvider,
    private readonly signUpUseCase: UseCase<SignUpUseCaseDTO.Parameters, SignUpUseCaseDTO.Result>,
    private readonly signInUseCase: UseCase<SignInUseCaseDTO.Parameters, SignInUseCaseDTO.Result>
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: SignUpControllerDTO.Parameters): SignUpControllerDTO.Result {
    const resultSignUp = await this.signUpUseCase.execute({
      email: parameters.body.email,
      password: parameters.body.password,
      username: parameters.body.username
    });
    if (resultSignUp.isFailure()) return failure(resultSignUp.value);
    const { user } = resultSignUp.value;

    const resultSignIn = await this.signInUseCase.execute({ user });
    if (resultSignIn.isFailure()) return failure(resultSignIn.value);
    const { accessToken } = resultSignIn.value;

    return success({
      data: { access_token: accessToken },
      status: StatusSuccess.CREATED
    });
  }
}

export namespace SignUpControllerDTO {
  type Body = {
    username: string;
    email: string;
    password: string;
  };

  export type Parameters = Readonly<HttpRequest<Body>>;

  type ResultError = SignUpUseCaseDTO.ResultError | SignInUseCaseDTO.ResultError;
  type ResultSuccess = Readonly<ResponseSuccess<{ access_token: string }>>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
