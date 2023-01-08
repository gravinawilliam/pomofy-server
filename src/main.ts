import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { selectFramework } from '@main/frameworks';

const start = async (): Promise<void> => {
  await selectFramework({
    logger: makeLoggerProvider()
  });
};

start();
