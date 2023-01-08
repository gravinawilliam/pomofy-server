import { v4 } from 'uuid';

import {
  GenerateIdCryptoProviderDTO,
  IGenerateIdCryptoProvider
} from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';

import { CryptoProviderMethods, ProviderError, ProviderNames } from '@errors/_shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

import { Id } from '@value-objects/id.value-object';

export class UuidCryptoProvider implements IGenerateIdCryptoProvider {
  constructor(private readonly loggerProvider: ISendErrorLoggerProvider) {}

  public generateId(): GenerateIdCryptoProviderDTO.Result {
    try {
      return success({ id: new Id({ id: v4() }) });
    } catch (error: any) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProviderNames.CRYPTO,
          method: CryptoProviderMethods.GENERATE_ID,
          externalName: 'uuid'
        }
      });

      this.loggerProvider.error({
        message: errorProvider.message,
        value: error
      });

      return failure(errorProvider);
    }
  }
}
