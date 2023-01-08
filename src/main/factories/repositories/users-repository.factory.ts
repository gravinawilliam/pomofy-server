import { IFindByEmailUsersRepository } from '@contracts/repositories/users/find-by-email.users-repository';
import { IFindByIdUsersRepository } from '@contracts/repositories/users/find-by-id.users-repository';
import { IFindByUsernameUsersRepository } from '@contracts/repositories/users/find-by-username.users-repository';
import { ISaveWithFacebookAccountUsersRepository } from '@contracts/repositories/users/save-with-facebook-account.users-repository';
import { ISaveWithGoogleAccountUsersRepository } from '@contracts/repositories/users/save-with-google-account.users-repository';
import { ISaveUsersRepository } from '@contracts/repositories/users/save.users-repository';
import { IUpdateUsersRepository } from '@contracts/repositories/users/update.users-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { UsersPrismaRepository } from '@infrastructure/database/prisma/repositories/users.prisma-repository';

export const makeUsersRepository = (): IFindByEmailUsersRepository &
  IFindByIdUsersRepository &
  IFindByUsernameUsersRepository &
  ISaveUsersRepository &
  ISaveWithFacebookAccountUsersRepository &
  ISaveWithGoogleAccountUsersRepository &
  IUpdateUsersRepository => new UsersPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
