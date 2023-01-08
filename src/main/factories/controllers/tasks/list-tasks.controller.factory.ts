import { Controller } from '@application/rest/_shared/controller.util';
import { ListTasksController, ListTasksControllerDTO } from '@application/rest/controllers/tasks/list-tasks.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeListTasksUseCase } from '@factories/use-cases/tasks/list-tasks.use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token.use-case.factory';

export const makeListTasksController = (): Controller<ListTasksControllerDTO.Parameters, ListTasksControllerDTO.Result> =>
  new ListTasksController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeListTasksUseCase());
