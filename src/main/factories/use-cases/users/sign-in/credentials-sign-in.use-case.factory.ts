import { makeValidateEmailProvider } from '@factories/providers/email-provider';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makePasswordProvider } from '@factories/providers/password-provider.factory';
import { makeUsersRepository } from '@factories/repositories/users-repository.factory';

import { CredentialsSignInUseCaseDTO, CredentialsSignInUseCase } from '@use-cases/users/credentials-sign-in.use-case';

import { UseCase } from '@domain/use-cases/_shared/use-case';

export const makeCredentialsSignInUseCase = (): UseCase<
  CredentialsSignInUseCaseDTO.Parameters,
  CredentialsSignInUseCaseDTO.Result
> =>
  new CredentialsSignInUseCase(
    makeLoggerProvider(),
    makeUsersRepository(),
    makePasswordProvider(),
    makeValidateEmailProvider()
  );
