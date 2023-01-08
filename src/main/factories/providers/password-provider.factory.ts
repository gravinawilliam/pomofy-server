import { IComparePasswordProvider } from '@contracts/providers/password/compare.password-provider';
import { IEncryptPasswordProvider } from '@contracts/providers/password/encrypt.password-provider';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import BCryptPasswordProvider from '@infrastructure/providers/password/bcrypt.password-provider';

export const makePasswordProvider = (): IEncryptPasswordProvider & IComparePasswordProvider =>
  new BCryptPasswordProvider(makeLoggerProvider());
