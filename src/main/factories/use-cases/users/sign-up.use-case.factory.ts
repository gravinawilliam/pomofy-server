import { makeValidateEmailProvider } from '@factories/providers/email-provider';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makePasswordProvider } from '@factories/providers/password-provider.factory';
import { makeUsersRepository } from '@factories/repositories/users-repository.factory';
import { makeSendEmailValidationTokenUseCase } from '@factories/use-cases/notifications/send-email-validation-token.use-case.factory';

import { UseCase } from '@use-cases/_shared/use-case';
import { SignUpUseCase, SignUpUseCaseDTO } from '@use-cases/users/sign-up.use-case';

export const makeSignUpUseCase = (): UseCase<SignUpUseCaseDTO.Parameters, SignUpUseCaseDTO.Result> =>
  new SignUpUseCase(
    makeLoggerProvider(),
    makeUsersRepository(),
    makeValidateEmailProvider(),
    makePasswordProvider(),
    makeSendEmailValidationTokenUseCase()
  );
