import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTokenJwtProvider } from '@factories/providers/token-provider.factory';
import { makeUsersRepository } from '@factories/repositories/users-repository.factory';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyAccessTokenUseCase, VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

export const makeVerifyAccessTokenUseCase = (): UseCase<
  VerifyAccessTokenUseCaseDTO.Parameters,
  VerifyAccessTokenUseCaseDTO.Result
> => new VerifyAccessTokenUseCase(makeLoggerProvider(), makeUsersRepository(), makeTokenJwtProvider());
