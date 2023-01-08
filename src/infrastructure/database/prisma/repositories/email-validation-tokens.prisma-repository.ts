import { PrismaClient } from '@prisma/client';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import {
  ISaveEmailValidationTokensRepository,
  SaveEmailValidationTokensRepositoryDTO
} from '@contracts/repositories/email-validation-tokens/save.email-validation-tokens-repository';

import { failure, success } from '@shared/utils/either.util';

import {
  EmailValidationTokensRepositoryMethods,
  RepositoryError,
  RepositoryNames
} from '@domain/entities/errors/_shared/repository.error';

export class EmailValidationTokensPrismaRepository implements ISaveEmailValidationTokensRepository {
  constructor(
    private readonly loggerProvider: ISendErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async save(
    parameters: SaveEmailValidationTokensRepositoryDTO.Parameters
  ): SaveEmailValidationTokensRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      await this.prisma.emailValidationTokensTable.create({
        data: {
          id: id.value,
          token: parameters.token,
          userId: parameters.user.id.value
        }
      });

      return success(undefined);
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.EMAIL_VALIDATION_TOKENS,
          method: EmailValidationTokensRepositoryMethods.SAVE,
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
