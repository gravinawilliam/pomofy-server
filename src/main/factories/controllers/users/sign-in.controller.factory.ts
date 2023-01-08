import { Controller } from '@application/rest/_shared/controller.util';
import { SignInController, SignInControllerDTO } from '@application/rest/controllers/users/sign-in.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeSignInUseCase } from '@factories/use-cases/users/sign-in/sign-in.use-case.factory';

export const makeSignInController = (): Controller<SignInControllerDTO.Parameters, SignInControllerDTO.Result> =>
  new SignInController(makeLoggerProvider(), makeSignInUseCase());
