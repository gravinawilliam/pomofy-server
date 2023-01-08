import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { APP_CONFIG } from '@infrastructure/configs/environments.config';

import { showBanner } from '@main/utils/banner.util';

import { AppModule } from './modules/app.module';

export class NestjsFramework {
  public async execute(logger: ISendInfoLoggerProvider): Promise<INestApplication> {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }));
    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks();
    await app.listen(APP_CONFIG.PORT, () => showBanner(logger));
    return app;
  }
}
