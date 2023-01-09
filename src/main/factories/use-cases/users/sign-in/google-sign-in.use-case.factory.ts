import { makeGoogleApiProvider } from '@factories/providers/google-api-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeUsersRepository } from '@factories/repositories/users-repository.factory';

import { GoogleSignInUseCase, GoogleSignInUseCaseDTO } from '@use-cases/users/google-sign-in.use-case';

import { UseCase } from '@domain/use-cases/_shared/use-case';

export const makeGoogleSignInUseCase = (): UseCase<GoogleSignInUseCaseDTO.Parameters, GoogleSignInUseCaseDTO.Result> =>
  new GoogleSignInUseCase(makeLoggerProvider(), makeGoogleApiProvider(), makeUsersRepository());
