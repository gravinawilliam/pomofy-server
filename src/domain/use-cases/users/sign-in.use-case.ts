import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { IGenerateJwtTokenProvider } from '@contracts/providers/token/generate-jwt.token-provider';

import { LoadUserFacebookApiError } from '@errors/providers/facebook-api/load-user-facebook-api.error';
import { LoadUserGoogleApiError } from '@errors/providers/google-api/load-user-google-api.error';

import { User } from '@models/user.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { ProviderError } from '@domain/entities/errors/_shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/_shared/repository.error';
import { UserSignInError, UserSignInMotive } from '@domain/entities/errors/models/users/user-sign-in.error';
import { InvalidEmailError } from '@domain/entities/errors/value-objects/invalid-email.error';
import { InvalidPasswordError } from '@domain/entities/errors/value-objects/invalid-password.error';
import { InvalidUsernameError } from '@domain/entities/errors/value-objects/invalid-username.error';
import { UseCase } from '@domain/use-cases/_shared/use-case';

import { CredentialsSignInUseCaseDTO } from './credentials-sign-in.use-case';
import { FacebookSignInUseCaseDTO } from './facebook-sign-in.use-case';
import { GoogleSignInUseCaseDTO } from './google-sign-in.use-case';

export class SignInUseCase extends UseCase<SignInUseCaseDTO.Parameters, SignInUseCaseDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider,
    private readonly tokenProvider: IGenerateJwtTokenProvider,
    private readonly facebookSignInUseCase: UseCase<FacebookSignInUseCaseDTO.Parameters, FacebookSignInUseCaseDTO.Result>,
    private readonly googleSignInUseCase: UseCase<GoogleSignInUseCaseDTO.Parameters, GoogleSignInUseCaseDTO.Result>,
    private readonly credentialsSignInUseCase: UseCase<
      CredentialsSignInUseCaseDTO.Parameters,
      CredentialsSignInUseCaseDTO.Result
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: SignInUseCaseDTO.Parameters): SignInUseCaseDTO.Result {
    if (parameters.credentials !== undefined) {
      const result = await this.credentialsSignInUseCase.execute({
        credentials: {
          password: parameters.credentials.password,
          usernameOrEmail: parameters.credentials.usernameOrEmail
        }
      });
      if (result.isFailure()) return failure(result.value);
      return this.generateToken(result.value);
    }

    if (parameters.facebookAccessToken !== undefined) {
      const result = await this.facebookSignInUseCase.execute({ facebookAccessToken: parameters.facebookAccessToken });
      if (result.isFailure()) return failure(result.value);
      return this.generateToken(result.value);
    }

    if (parameters.googleAccessToken !== undefined) {
      const result = await this.googleSignInUseCase.execute({ googleAccessToken: parameters.googleAccessToken });
      if (result.isFailure()) return failure(result.value);
      return this.generateToken(result.value);
    }

    if (parameters.user === undefined) return failure(new UserSignInError({ motive: UserSignInMotive.USER_NOT_FOUND }));

    return this.generateToken({ user: parameters.user });
  }

  private generateToken(parameters: { user: Pick<User, 'id'> }): Either<ProviderError, { accessToken: string }> {
    const resultGenerateJwt = this.tokenProvider.generateJwt({ user: { id: parameters.user.id } });
    if (resultGenerateJwt.isFailure()) return failure(resultGenerateJwt.value);
    return success({ accessToken: resultGenerateJwt.value.jwtToken });
  }
}

export namespace SignInUseCaseDTO {
  export type Parameters = Readonly<{
    credentials?: {
      usernameOrEmail: string;
      password: string;
    };
    facebookAccessToken?: string;
    googleAccessToken?: string;
    user?: Pick<User, 'id'>;
  }>;

  export type ResultError =
    | ProviderError
    | RepositoryError
    | InvalidUsernameError
    | InvalidPasswordError
    | InvalidEmailError
    | LoadUserFacebookApiError
    | LoadUserGoogleApiError
    | UserSignInError;
  export type ResultSuccess = Readonly<{ accessToken: string }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
