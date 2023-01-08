import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTasksRepository } from '@factories/repositories/tasks-repository.factory';

import { UseCase } from '@use-cases/_shared/use-case';
import { ChangeTaskStatusUseCase, ChangeTaskStatusUseCaseDTO } from '@use-cases/tasks/change-task-status.use-case';

export const makeChangeTaskStatusUseCase = (): UseCase<
  ChangeTaskStatusUseCaseDTO.Parameters,
  ChangeTaskStatusUseCaseDTO.Result
> => new ChangeTaskStatusUseCase(makeLoggerProvider(), makeTasksRepository());
