import { PrismaClient } from '@prisma/client';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import {
  FindByIdTasksRepositoryDTO,
  IFindByIdTasksRepository
} from '@contracts/repositories/tasks/find-by-id.tasks-repository';
import { FindTasksRepositoryDTO, IFindTasksRepository } from '@contracts/repositories/tasks/find.tasks-repository';
import { ISaveTasksRepository, SaveTasksRepositoryDTO } from '@contracts/repositories/tasks/save.tasks-repository';
import { IUpdateTasksRepository, UpdateTasksRepositoryDTO } from '@contracts/repositories/tasks/update.tasks-repository';

import { RepositoryError, RepositoryNames, TasksRepositoryMethods } from '@errors/_shared/repository.error';

import { Task } from '@models/task.model';

import { failure, success } from '@shared/utils/either.util';

import { Id } from '@value-objects/id.value-object';

export class TasksPrismaRepository
  implements IFindTasksRepository, IFindByIdTasksRepository, ISaveTasksRepository, IUpdateTasksRepository
{
  constructor(
    private readonly loggerProvider: ISendErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findById(parameters: FindByIdTasksRepositoryDTO.Parameters): FindByIdTasksRepositoryDTO.Result {
    try {
      const found = await this.prisma.tasksTable.findFirst({
        where: {
          id: parameters.task.id.value,
          userId: parameters.task.user.id.value
        }
      });
      if (found === null) {
        return success({
          task: undefined
        });
      }

      return success({
        task: {
          id: parameters.task.id,
          name: found.name,
          status: Task.selectTaskStatus(found.status)
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.TASKS,
          method: TasksRepositoryMethods.FIND_BY_ID,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.error({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async find(parameters: FindTasksRepositoryDTO.Parameters): FindTasksRepositoryDTO.Result {
    try {
      const list = await this.prisma.tasksTable.findMany({
        where: {
          status: parameters.task.status,
          userId: parameters.task.user.id.value
        }
      });

      return success({
        tasks: list.map(task => ({
          id: new Id({ id: task.id }),
          name: task.name,
          status: Task.selectTaskStatus(task.status)
        }))
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.TASKS,
          method: TasksRepositoryMethods.FIND,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.error({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async save(parameters: SaveTasksRepositoryDTO.Parameters): SaveTasksRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      const created = await this.prisma.tasksTable.create({
        data: {
          id: id.value,
          name: parameters.task.name,
          status: parameters.task.status,
          userId: parameters.task.user.id.value
        }
      });

      return success({ task: { id: new Id({ id: created.id }) } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.TASKS,
          method: TasksRepositoryMethods.SAVE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.error({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async update(parameters: UpdateTasksRepositoryDTO.Parameters): UpdateTasksRepositoryDTO.Result {
    try {
      await this.prisma.tasksTable.update({
        where: {
          id: parameters.task.id.value
        },
        data: {
          status: parameters.task.status
        }
      });

      return success(undefined);
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.TASKS,
          method: TasksRepositoryMethods.UPDATE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.error({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }
}
