import { ISaveEmailValidationTokensRepository } from '@contracts/repositories/email-validation-tokens/save.email-validation-tokens-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { EmailValidationTokensPrismaRepository } from '@infrastructure/database/prisma/repositories/email-validation-tokens.prisma-repository';

export const makeEmailValidationTokensRepository = (): ISaveEmailValidationTokensRepository =>
  new EmailValidationTokensPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
