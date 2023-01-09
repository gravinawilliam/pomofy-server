import { IValidateEmailProvider } from '@contracts/providers/email/validate.email-provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { IComparePasswordProvider } from '@contracts/providers/password/compare.password-provider';
import { IFindByEmailUsersRepository } from '@contracts/repositories/users/find-by-email.users-repository';
import { IFindByUsernameUsersRepository } from '@contracts/repositories/users/find-by-username.users-repository';

import { Either, failure, success } from '@shared/utils/either.util';

import { ProviderError } from '@domain/entities/errors/_shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/_shared/repository.error';
import { UserSignInError, UserSignInMotive } from '@domain/entities/errors/models/users/user-sign-in.error';
import { InvalidEmailError } from '@domain/entities/errors/value-objects/invalid-email.error';
import { InvalidPasswordError } from '@domain/entities/errors/value-objects/invalid-password.error';
import { InvalidUsernameError } from '@domain/entities/errors/value-objects/invalid-username.error';
import { User } from '@domain/entities/models/user.model';
import { Password } from '@domain/entities/value-objects/password.value-object';
import { Username } from '@domain/entities/value-objects/username.value-object';
import { UseCase } from '@domain/use-cases/_shared/use-case';

export class CredentialsSignInUseCase extends UseCase<
  CredentialsSignInUseCaseDTO.Parameters,
  CredentialsSignInUseCaseDTO.Result
> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider,
    private readonly usersRepository: IFindByEmailUsersRepository & IFindByUsernameUsersRepository,
    private readonly passwordProvider: IComparePasswordProvider,
    private readonly emailProvider: IValidateEmailProvider
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: CredentialsSignInUseCaseDTO.Parameters
  ): CredentialsSignInUseCaseDTO.Result {
    const resultValidatePassword = Password.validate({
      password: parameters.credentials.password
    });
    if (resultValidatePassword.isFailure()) return failure(resultValidatePassword.value);
    const { passwordValidated } = resultValidatePassword.value;

    const resultFindUser = await this.findUser({
      usernameOrEmail: parameters.credentials.usernameOrEmail
    });
    if (resultFindUser.isFailure()) return failure(resultFindUser.value);
    const { user } = resultFindUser.value;

    const resultComparePassword = await this.passwordProvider.compare({
      password: passwordValidated,
      passwordEncrypted: user.password
    });
    if (resultComparePassword.isFailure()) return failure(resultComparePassword.value);
    if (resultComparePassword.value.isEqual === false) {
      return failure(new UserSignInError({ motive: UserSignInMotive.PASSWORD_NOT_MATCH }));
    }

    return success({ user: { id: user.id } });
  }

  private async findUser(parameters: {
    usernameOrEmail: string;
  }): Promise<
    Either<
      InvalidEmailError | InvalidUsernameError | ProviderError | UserSignInError | RepositoryError,
      { user: Pick<User, 'id' | 'password'> }
    >
  > {
    if (parameters.usernameOrEmail.includes('@')) return this.findUserByEmail({ email: parameters.usernameOrEmail });
    return this.findUserByUsername({ username: parameters.usernameOrEmail });
  }

  private async findUserByEmail(parameters: {
    email: string;
  }): Promise<
    Either<UserSignInError | RepositoryError | ProviderError | InvalidEmailError, { user: Pick<User, 'id' | 'password'> }>
  > {
    const resultValidateEmail = this.emailProvider.validate({
      email: parameters.email
    });
    if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value);
    const { emailValidated } = resultValidateEmail.value;

    const result = await this.usersRepository.findByEmail({
      email: emailValidated
    });
    if (result.isFailure()) return failure(result.value);
    if (result.value.user === undefined) {
      return failure(
        new UserSignInError({
          motive: UserSignInMotive.EMAIL_NOT_FOUND
        })
      );
    }
    const { user } = result.value;

    return success({ user: { id: user.id, password: user.password } });
  }

  private async findUserByUsername(parameters: {
    username: string;
  }): Promise<
    Either<
      InvalidUsernameError | InvalidEmailError | RepositoryError | UserSignInError,
      { user: Pick<User, 'id' | 'password'> }
    >
  > {
    const resultValidateUsername = Username.validate({
      username: parameters.username
    });
    if (resultValidateUsername.isFailure()) return failure(resultValidateUsername.value);
    const { usernameValidated } = resultValidateUsername.value;

    const result = await this.usersRepository.findByUsername({
      username: usernameValidated
    });
    if (result.isFailure()) return failure(result.value);
    if (result.value.user === undefined) {
      return failure(
        new UserSignInError({
          motive: UserSignInMotive.USERNAME_NOT_FOUND
        })
      );
    }
    const { user } = result.value;

    return success({ user: { id: user.id, password: user.password } });
  }
}

export namespace CredentialsSignInUseCaseDTO {
  export type Parameters = Readonly<{
    credentials: { usernameOrEmail: string; password: string };
  }>;

  type ResultError =
    | InvalidEmailError
    | InvalidPasswordError
    | InvalidUsernameError
    | UserSignInError
    | ProviderError
    | RepositoryError;
  type ResultSuccess = Readonly<{ user: Pick<User, 'id'> }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
