import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTasksRepository } from '@factories/repositories/tasks-repository.factory';

import { UseCase } from '@use-cases/_shared/use-case';
import { CreateTaskUseCase, CreateTaskUseCaseDTO } from '@use-cases/tasks/create-task.use-case';

export const makeCreateTaskUseCase = (): UseCase<CreateTaskUseCaseDTO.Parameters, CreateTaskUseCaseDTO.Result> =>
  new CreateTaskUseCase(makeLoggerProvider(), makeTasksRepository());
