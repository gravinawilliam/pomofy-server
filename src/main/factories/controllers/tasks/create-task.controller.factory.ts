import { Controller } from '@application/rest/_shared/controller.util';
import {
  CreateTaskController,
  CreateTaskControllerDTO
} from '@application/rest/controllers/tasks/create-task.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCreateTaskUseCase } from '@factories/use-cases/tasks/create-task.use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token.use-case.factory';

export const makeCreateTaskController = (): Controller<
  CreateTaskControllerDTO.Parameters,
  CreateTaskControllerDTO.Result
> => new CreateTaskController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeCreateTaskUseCase());
