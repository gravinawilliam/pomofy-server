import { makeSendEmailProvider } from '@factories/providers/email-provider';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeEmailValidationTokensRepository } from '@factories/repositories/email-validation-tokens-repository.factory';

import { UseCase } from '@domain/use-cases/_shared/use-case';
import {
  SendEmailValidationTokenUseCase,
  SendEmailValidationTokenUseCaseDTO
} from '@domain/use-cases/notifications/send-email-validation-token.use-case';

export const makeSendEmailValidationTokenUseCase = (): UseCase<
  SendEmailValidationTokenUseCaseDTO.Parameters,
  SendEmailValidationTokenUseCaseDTO.Result
> =>
  new SendEmailValidationTokenUseCase(
    makeLoggerProvider(),
    makeEmailValidationTokensRepository(),
    makeSendEmailProvider()
  );
