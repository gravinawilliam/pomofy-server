import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTokenJwtProvider } from '@factories/providers/token-provider.factory';
import { makeCredentialsSignInUseCase } from '@factories/use-cases/users/sign-in/credentials-sign-in.use-case.factory';
import { makeFacebookSignInUseCase } from '@factories/use-cases/users/sign-in/facebook-sign-in.use-case.factory';
import { makeGoogleSignInUseCase } from '@factories/use-cases/users/sign-in/google-sign-in.use-case.factory';

import { UseCase } from '@domain/use-cases/_shared/use-case';
import { SignInUseCase, SignInUseCaseDTO } from '@domain/use-cases/users/sign-in.use-case';

export const makeSignInUseCase = (): UseCase<SignInUseCaseDTO.Parameters, SignInUseCaseDTO.Result> =>
  new SignInUseCase(
    makeLoggerProvider(),
    makeTokenJwtProvider(),
    makeFacebookSignInUseCase(),
    makeGoogleSignInUseCase(),
    makeCredentialsSignInUseCase()
  );
