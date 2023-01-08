import { Controller } from '@application/rest/_shared/controller.util';
import {
  ChangeTaskStatusController,
  ChangeTaskStatusControllerDTO
} from '@application/rest/controllers/tasks/change-task-status.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeChangeTaskStatusUseCase } from '@factories/use-cases/tasks/change-task-status.use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token.use-case.factory';

export const makeChangeTaskStatusController = (): Controller<
  ChangeTaskStatusControllerDTO.Parameters,
  ChangeTaskStatusControllerDTO.Result
> => new ChangeTaskStatusController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeChangeTaskStatusUseCase());
