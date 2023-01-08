import { makeFacebookApiProvider } from '@factories/providers/facebook-api-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeUsersRepository } from '@factories/repositories/users-repository.factory';

import { UseCase } from '@domain/use-cases/_shared/use-case';
import { FacebookSignInUseCase, FacebookSignInUseCaseDTO } from '@domain/use-cases/users/facebook-sign-in.use-case';

export const makeFacebookSignInUseCase = (): UseCase<
  FacebookSignInUseCaseDTO.Parameters,
  FacebookSignInUseCaseDTO.Result
> => new FacebookSignInUseCase(makeLoggerProvider(), makeFacebookApiProvider(), makeUsersRepository());
