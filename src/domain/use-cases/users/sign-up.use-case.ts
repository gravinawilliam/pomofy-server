import { IValidateEmailProvider } from '@contracts/providers/email/validate.email-provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { IEncryptPasswordProvider } from '@contracts/providers/password/encrypt.password-provider';
import { IFindByEmailUsersRepository } from '@contracts/repositories/users/find-by-email.users-repository';
import { IFindByUsernameUsersRepository } from '@contracts/repositories/users/find-by-username.users-repository';
import { ISaveUsersRepository } from '@contracts/repositories/users/save.users-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidEmailError, InvalidEmailMotive } from '@errors/value-objects/invalid-email.error';
import { InvalidPasswordError } from '@errors/value-objects/invalid-password.error';
import { InvalidUsernameError, InvalidUsernameMotive } from '@errors/value-objects/invalid-username.error';

import { User } from '@models/user.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { SendEmailValidationTokenUseCaseDTO } from '@use-cases/notifications/send-email-validation-token.use-case';

import { Email } from '@value-objects/email.value-object';
import { Password } from '@value-objects/password.value-object';
import { Username } from '@value-objects/username.value-object';

import { UseCase } from '@domain/use-cases/_shared/use-case';

export class SignUpUseCase extends UseCase<SignUpUseCaseDTO.Parameters, SignUpUseCaseDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider,
    private readonly usersRepository: IFindByUsernameUsersRepository & IFindByEmailUsersRepository & ISaveUsersRepository,
    private readonly emailProvider: IValidateEmailProvider,
    private readonly passwordProvider: IEncryptPasswordProvider,
    private readonly sendEmailValidationTokenUseCase: UseCase<
      SendEmailValidationTokenUseCaseDTO.Parameters,
      SendEmailValidationTokenUseCaseDTO.Result
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: SignUpUseCaseDTO.Parameters): SignUpUseCaseDTO.Result {
    const resultValidatePassword = await this.validatePassword({ password: parameters.password });
    if (resultValidatePassword.isFailure()) return failure(resultValidatePassword.value);
    const { passwordEncrypted } = resultValidatePassword.value;
    const resultValidateUsername = await this.validateUsername({ username: parameters.username });
    if (resultValidateUsername.isFailure()) return failure(resultValidateUsername.value);
    const { usernameValidated } = resultValidateUsername.value;
    const resultValidateEmail = await this.validateEmail({ email: parameters.email });
    if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value);
    const { emailValidated } = resultValidateEmail.value;
    const resultSaveUser = await this.usersRepository.save({
      password: passwordEncrypted,
      username: usernameValidated,
      email: emailValidated,
      isEmailValidated: false
    });
    if (resultSaveUser.isFailure()) return failure(resultSaveUser.value);
    const { user } = resultSaveUser.value;
    await this.sendEmailValidationTokenUseCase.execute({
      user: { id: user.id, email: emailValidated, username: usernameValidated }
    });
    return success({ user });
  }

  private async validateUsername(parameters: {
    username: string;
  }): Promise<Either<InvalidUsernameError | RepositoryError, { usernameValidated: Username }>> {
    const resultValidateEmail = Username.validate({ username: parameters.username });
    if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value);
    const { usernameValidated } = resultValidateEmail.value;

    const resultFindUserByUsername = await this.usersRepository.findByUsername({
      username: usernameValidated
    });
    if (resultFindUserByUsername.isFailure()) return failure(resultFindUserByUsername.value);
    if (resultFindUserByUsername.value.user !== undefined) {
      return failure(new InvalidUsernameError({ motive: InvalidUsernameMotive.ALREADY_EXISTS }));
    }

    return success({ usernameValidated });
  }

  private async validateEmail(parameters: {
    email: string;
  }): Promise<Either<InvalidEmailError | RepositoryError | ProviderError, { emailValidated: Email }>> {
    const resultValidateEmail = this.emailProvider.validate({
      email: parameters.email
    });
    if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value);
    const { emailValidated } = resultValidateEmail.value;

    const resultFindUserByEmail = await this.usersRepository.findByEmail({
      email: emailValidated
    });
    if (resultFindUserByEmail.isFailure()) return failure(resultFindUserByEmail.value);
    if (resultFindUserByEmail.value.user !== undefined) {
      return failure(new InvalidEmailError({ motive: InvalidEmailMotive.ALREADY_EXISTS }));
    }

    return success({ emailValidated });
  }

  private async validatePassword(parameters: {
    password: string;
  }): Promise<Either<InvalidPasswordError | ProviderError, { passwordEncrypted: Password }>> {
    const validatePassword = Password.validate({ password: parameters.password });
    if (validatePassword.isFailure()) return failure(validatePassword.value);
    const resultEncryptPassword = await this.passwordProvider.encrypt({
      password: validatePassword.value.passwordValidated
    });
    if (resultEncryptPassword.isFailure()) return failure(resultEncryptPassword.value);
    return success(resultEncryptPassword.value);
  }
}

export namespace SignUpUseCaseDTO {
  export type Parameters = Readonly<{
    username: string;
    email: string;
    password: string;
  }>;

  export type ResultError =
    | InvalidUsernameError
    | InvalidPasswordError
    | InvalidEmailError
    | ProviderError
    | RepositoryError;
  export type ResultSuccess = Readonly<{ user: Pick<User, 'id'> }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
