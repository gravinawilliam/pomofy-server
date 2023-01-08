import { mock, MockProxy } from 'jest-mock-extended';

import { IValidateEmailProvider, ValidateEmailProviderDTO } from '@contracts/providers/email/validate.email-provider';
import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import {
  EncryptPasswordProviderDTO,
  IEncryptPasswordProvider
} from '@contracts/providers/password/encrypt.password-provider';
import {
  IFindByEmailUsersRepository,
  FindByEmailUsersRepositoryDTO
} from '@contracts/repositories/users/find-by-email.users-repository';
import {
  IFindByUsernameUsersRepository,
  FindByUsernameUsersRepositoryDTO
} from '@contracts/repositories/users/find-by-username.users-repository';
import { ISaveUsersRepository, SaveUsersRepositoryDTO } from '@contracts/repositories/users/save.users-repository';

import {
  EmailProviderMethods,
  PasswordProviderMethods,
  ProviderError,
  ProviderNames
} from '@errors/_shared/provider.error';
import { RepositoryError, RepositoryNames, UsersRepositoryMethods } from '@errors/_shared/repository.error';
import { InvalidEmailError, InvalidEmailMotive } from '@errors/value-objects/invalid-email.error';
import { InvalidUsernameError, InvalidUsernameMotive } from '@errors/value-objects/invalid-username.error';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

import { Email } from '@value-objects/email.value-object';
import { Password } from '@value-objects/password.value-object';
import { Username } from '@value-objects/username.value-object';

import {
  InvalidPasswordError,
  InvalidPasswordMotive
} from '@domain/entities/errors/value-objects/invalid-password.error';
import { UseCase } from '@domain/use-cases/_shared/use-case';
import { SendEmailValidationTokenUseCaseDTO } from '@domain/use-cases/notifications/send-email-validation-token.use-case';
import { SignUpUseCase, SignUpUseCaseDTO } from '@domain/use-cases/users/sign-up.use-case';

describe('Sign up USE CASE', () => {
  let sut: UseCase<SignUpUseCaseDTO.Parameters, SignUpUseCaseDTO.Result>;
  let loggerProvider: MockProxy<ISendErrorLoggerProvider & ISendInfoLoggerProvider>;
  let usersRepository: MockProxy<IFindByUsernameUsersRepository & IFindByEmailUsersRepository & ISaveUsersRepository>;
  let emailProvider: MockProxy<IValidateEmailProvider>;
  let passwordProvider: MockProxy<IEncryptPasswordProvider>;
  let sendEmailValidationTokenUseCase: MockProxy<
    UseCase<SendEmailValidationTokenUseCaseDTO.Parameters, SendEmailValidationTokenUseCaseDTO.Result>
  >;

  const correctParametersSut: SignUpUseCaseDTO.Parameters = {
    email: Generate.email().value,
    username: Generate.username().value,
    password: Generate.password().value
  };
  const PASSWORD_ENCRYPTED = Generate.password();
  const USER_ID = Generate.id();

  beforeAll(() => {
    usersRepository = mock();
    usersRepository.findByUsername.mockResolvedValue(success({ user: undefined }));
    usersRepository.findByEmail.mockResolvedValue(success({ user: undefined }));
    usersRepository.save.mockResolvedValue(success({ user: { id: USER_ID } }));

    loggerProvider = mock();
    loggerProvider.error.mockReturnValue();
    loggerProvider.info.mockReturnValue();

    emailProvider = mock();
    emailProvider.validate.mockReturnValue(success({ emailValidated: new Email({ email: correctParametersSut.email }) }));

    passwordProvider = mock();
    passwordProvider.encrypt.mockResolvedValue(
      success({
        passwordEncrypted: PASSWORD_ENCRYPTED
      })
    );

    sendEmailValidationTokenUseCase = mock();
  });

  beforeEach(() => {
    sut = new SignUpUseCase(
      loggerProvider,
      usersRepository,
      emailProvider,
      passwordProvider,
      sendEmailValidationTokenUseCase
    );
  });

  it('should call find by username users repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(usersRepository.findByUsername).toHaveBeenCalledWith({
      username: new Username({ username: correctParametersSut.username })
    } as FindByUsernameUsersRepositoryDTO.Parameters);
    expect(usersRepository.findByUsername).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if find by username users repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: UsersRepositoryMethods.FIND_BY_USERNAME,
        name: RepositoryNames.USERS
      }
    });
    usersRepository.findByUsername.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.findByUsername).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should return InvalidUsernameError if username is invalid', async () => {
    const result = await sut.execute({
      ...correctParametersSut,
      username: 'wg'
    });

    expect(result.value).toEqual(new InvalidUsernameError({ motive: InvalidUsernameMotive.IS_LESS_THAN_3_CHARACTERS }));
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should return InvalidUsernameError if username already exists', async () => {
    usersRepository.findByUsername.mockResolvedValueOnce(
      success({ user: { id: Generate.id(), password: Generate.password() } })
    );

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(new InvalidUsernameError({ motive: InvalidUsernameMotive.ALREADY_EXISTS }));
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should call find by email users repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith({
      email: new Email({ email: correctParametersSut.email })
    } as FindByEmailUsersRepositoryDTO.Parameters);
    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if find by email users repository return Error', async () => {
    const error = new RepositoryError({
      repository: { method: UsersRepositoryMethods.FIND_BY_EMAIL, name: RepositoryNames.USERS }
    });
    usersRepository.findByEmail.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should call validate email validator provider with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(emailProvider.validate).toHaveBeenCalledWith({
      email: correctParametersSut.email
    } as ValidateEmailProviderDTO.Parameters);
    expect(emailProvider.validate).toHaveBeenCalledTimes(1);
  });

  it('should return ProviderError if validate email validator provider return Error', async () => {
    const error = new ProviderError({
      provider: {
        method: EmailProviderMethods.VALIDATE,
        name: ProviderNames.EMAIL
      }
    });
    emailProvider.validate.mockReturnValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(emailProvider.validate).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should return InvalidEmailError if email already exists', async () => {
    usersRepository.findByEmail.mockResolvedValueOnce(
      success({ user: { id: Generate.id(), password: Generate.password() } })
    );

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(new InvalidEmailError({ motive: InvalidEmailMotive.ALREADY_EXISTS }));
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should return InvalidPasswordError if validate password return Error', async () => {
    const error = new InvalidPasswordError({
      motive: InvalidPasswordMotive.IS_LESS_THAN_8_CHARACTERS
    });
    jest.spyOn(Password, 'validate').mockImplementationOnce(() => failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should call encrypt password provider with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(passwordProvider.encrypt).toHaveBeenCalledWith({
      password: new Password({ password: correctParametersSut.password })
    } as EncryptPasswordProviderDTO.Parameters);
    expect(passwordProvider.encrypt).toHaveBeenCalledTimes(1);
  });

  it('should return ProviderError if encrypt password provider return Error', async () => {
    const error = new ProviderError({
      provider: {
        method: PasswordProviderMethods.ENCRYPT,
        name: ProviderNames.PASSWORD
      }
    });
    passwordProvider.encrypt.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(passwordProvider.encrypt).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).not.toHaveBeenCalled();
  });

  it('should call save users repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(usersRepository.save).toHaveBeenCalledWith({
      email: new Email({ email: correctParametersSut.email }),
      password: PASSWORD_ENCRYPTED,
      username: new Username({ username: correctParametersSut.username }),
      isEmailValidated: false
    } as SaveUsersRepositoryDTO.Parameters);
    expect(usersRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if save users repository return Error', async () => {
    const error = new RepositoryError({
      repository: { method: UsersRepositoryMethods.SAVE, name: RepositoryNames.USERS }
    });
    usersRepository.save.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(usersRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should call send email validation token use case with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(sendEmailValidationTokenUseCase.execute).toHaveBeenCalledWith({
      user: {
        email: new Email({ email: correctParametersSut.email }),
        id: USER_ID,
        username: new Username({ username: correctParametersSut.username })
      }
    } as SendEmailValidationTokenUseCaseDTO.Parameters);
    expect(sendEmailValidationTokenUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
