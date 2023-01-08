import endent from 'endent';
import figlet from 'figlet';

import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { APP_CONFIG, APP_INFO, GLOBAL_CONFIG } from '@infrastructure/configs/environments.config';

export const showBanner = (logger: ISendInfoLoggerProvider) => {
  logger.info({
    message: endent`Application started successfully!
    ${figlet.textSync(APP_INFO.APP_NAME)}
     Name: ${APP_INFO.APP_NAME}
     Description: ${APP_INFO.APP_DESCRIPTION}
     Version: ${APP_INFO.APP_VERSION}
     Port: ${APP_CONFIG.PORT}
     Docs Path: ${APP_CONFIG.DOCS_PATH}
     Environment: ${GLOBAL_CONFIG.ENVIRONMENT}
     Framework: ${APP_CONFIG.FRAMEWORK}
     Author: ${APP_INFO.AUTHOR_NAME}
     Email: ${APP_INFO.AUTHOR_EMAIL}
  `
  });
};
