import { IFindByIdTasksRepository } from '@contracts/repositories/tasks/find-by-id.tasks-repository';
import { IFindTasksRepository } from '@contracts/repositories/tasks/find.tasks-repository';
import { ISaveTasksRepository } from '@contracts/repositories/tasks/save.tasks-repository';
import { IUpdateTasksRepository } from '@contracts/repositories/tasks/update.tasks-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { TasksPrismaRepository } from '@infrastructure/database/prisma/repositories/tasks.prisma-repository';

export const makeTasksRepository = (): IFindTasksRepository &
  IFindByIdTasksRepository &
  ISaveTasksRepository &
  IUpdateTasksRepository => new TasksPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
