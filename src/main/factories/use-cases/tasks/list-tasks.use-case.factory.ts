import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTasksRepository } from '@factories/repositories/tasks-repository.factory';

import { UseCase } from '@use-cases/_shared/use-case';
import { ListTasksUseCase, ListTasksUseCaseDTO } from '@use-cases/tasks/list-tasks.use-case';

export const makeListTasksUseCase = (): UseCase<ListTasksUseCaseDTO.Parameters, ListTasksUseCaseDTO.Result> =>
  new ListTasksUseCase(makeLoggerProvider(), makeTasksRepository());
