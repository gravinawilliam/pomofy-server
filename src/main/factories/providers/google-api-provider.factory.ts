import { ILoadUserGoogleApiProvider } from '@contracts/providers/google-api/load-user.google-api-provider';

import { makeHttpClientProvider } from '@factories/providers/http-client-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { GoogleApiProvider } from '@infrastructure/providers/google-api/google-api.provider';

export const makeGoogleApiProvider = (): ILoadUserGoogleApiProvider =>
  new GoogleApiProvider(makeLoggerProvider(), makeHttpClientProvider());
