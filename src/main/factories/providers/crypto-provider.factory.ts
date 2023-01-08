import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { UuidCryptoProvider } from '@infrastructure/providers/crypto/uuid.crypto-provider';

export const makeCryptoProvider = (): IGenerateIdCryptoProvider => new UuidCryptoProvider(makeLoggerProvider());
