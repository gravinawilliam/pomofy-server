import { Body, Controller, Get, Headers, Patch, Post, Request, Res } from '@nestjs/common';

import { makeChangeTaskStatusController } from '@factories/controllers/tasks/change-task-status.controller.factory';
import { makeCreateTaskController } from '@factories/controllers/tasks/create-task.controller.factory';
import { makeListTasksController } from '@factories/controllers/tasks/list-tasks.controller.factory';

import { adapterRoute } from '@main/frameworks/nestjs/adapters/route-adapter';

@Controller('tasks')
export class TasksRoutes {
  @Post('/create')
  signUp(@Request() request: any, @Res() response: any, @Body() body: any, @Headers('Authorization') authToken: string) {
    return adapterRoute(makeCreateTaskController())({
      response,
      body,
      authToken,
      request
    });
  }

  @Get('/list')
  list(@Request() request: any, @Res() response: any, @Body() body: any, @Headers('Authorization') authToken: string) {
    return adapterRoute(makeListTasksController())({
      response,
      body,
      authToken,
      request
    });
  }

  @Patch('/change-status')
  changeStatus(
    @Request() request: any,
    @Res() response: any,
    @Body() body: any,
    @Headers('Authorization') authToken: string
  ) {
    return adapterRoute(makeChangeTaskStatusController())({
      response,
      body,
      authToken,
      request
    });
  }
}
