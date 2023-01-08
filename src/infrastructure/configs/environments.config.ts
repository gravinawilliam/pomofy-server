import {
  getEnvironmentNumber,
  getEnvironmentString
} from '@infrastructure/providers/get-envs/dot-environment.get-environments-provider';

import { Environment } from '@domain/configs/environment.config';

export const GLOBAL_CONFIG = {
  ENVIRONMENT: getEnvironmentString({
    key: 'NODE_ENV',
    defaultValue: Environment.LOCAL
  }) as Environment,
  IS_DEVELOPMENT:
    getEnvironmentString({
      key: 'NODE_ENV',
      defaultValue: Environment.LOCAL
    }) === Environment.DEVELOPMENT,
  IS_PRODUCTION:
    getEnvironmentString({
      key: 'NODE_ENV',
      defaultValue: Environment.LOCAL
    }) === Environment.PRODUCTION,
  LOGS_FOLDER: getEnvironmentString({
    key: 'LOGS_FOLDER',
    defaultValue: 'logs'
  })
};

export const APP_INFO = {
  APP_VERSION: getEnvironmentString({
    key: 'APP_VERSION',
    defaultValue: 'readPkg.readPackageSync().version'
  }),
  APP_NAME: getEnvironmentString({
    key: 'APP_NAME',
    defaultValue: 'Pomofy'
  }),
  APP_DESCRIPTION: getEnvironmentString({
    key: 'APP_DESCRIPTION',
    defaultValue: '🚀 To infinity and beyond!'
  }),
  AUTHOR_NAME: getEnvironmentString({
    key: 'AUTHOR_NAME',
    defaultValue: 'William Gravina'
  }),
  AUTHOR_EMAIL: getEnvironmentString({
    key: 'AUTHOR_EMAIL',
    defaultValue: 'dev.gravina@gmail.com'
  })
};

export const APP_CONFIG = {
  PORT: getEnvironmentNumber({
    key: 'PORT',
    defaultValue: 2222
  }),
  FRAMEWORK: getEnvironmentString({
    key: 'FRAMEWORK',
    defaultValue: 'express'
  }) as 'express' | 'nestjs',
  DOCS_PATH: getEnvironmentString({
    key: 'DOCS_PATH',
    defaultValue: '/docs'
  }),
  APP_CONFIG: getEnvironmentString({
    key: 'DOCS_PATH',
    defaultValue: '/docs'
  })
};
