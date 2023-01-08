import { IGetHttpClientProvider } from '@contracts/providers/http-client/get.http-client-provider';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { AxiosHttpClientProvider } from '@infrastructure/providers/http-client/axios.http-client-provider';

export const makeHttpClientProvider = (): IGetHttpClientProvider => new AxiosHttpClientProvider(makeLoggerProvider());
