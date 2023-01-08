import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheck, HealthCheckService, TerminusModule } from '@nestjs/terminus';

import { TasksRoutes } from '@main/frameworks/nestjs/routes/tasks.routes';
import { UsersRoutes } from '@main/frameworks/nestjs/routes/users.routes';

@Controller('health')
export class HealthRoute {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}

@Module({
  imports: [TerminusModule, ConfigModule.forRoot()],
  controllers: [HealthRoute, UsersRoutes, TasksRoutes],
  providers: []
})
export class AppModule {}
