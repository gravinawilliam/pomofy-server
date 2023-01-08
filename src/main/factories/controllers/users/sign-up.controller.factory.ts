import { Controller } from '@application/rest/_shared/controller.util';
import { SignUpController, SignUpControllerDTO } from '@application/rest/controllers/users/sign-up.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeSignInUseCase } from '@factories/use-cases/users/sign-in/sign-in.use-case.factory';
import { makeSignUpUseCase } from '@factories/use-cases/users/sign-up.use-case.factory';

export const makeSignUpController = (): Controller<SignUpControllerDTO.Parameters, SignUpControllerDTO.Result> =>
  new SignUpController(makeLoggerProvider(), makeSignUpUseCase(), makeSignInUseCase());
