import { Body, Controller, Headers, Post, Request, Res } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

import { makeSignInController } from '@factories/controllers/users/sign-in.controller.factory';
import { makeSignUpController } from '@factories/controllers/users/sign-up.controller.factory';

import { adapterRoute } from '@main/frameworks/nestjs/adapters/route-adapter';

export class SignUpBody {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;
}

@Controller('users')
export class UsersRoutes {
  @Post('/sign-up')
  signUp(
    @Request() request: any,
    @Res() response: any,
    @Body() body: SignUpBody,
    @Headers('Authorization') authToken: string
  ) {
    return adapterRoute(makeSignUpController())({
      response,
      body,
      authToken,
      request
    });
  }

  @Post('/sign-in')
  signIn(@Request() request: any, @Res() response: any, @Body() body: any, @Headers('Authorization') authToken: string) {
    return adapterRoute(makeSignInController())({
      response,
      body,
      authToken,
      request
    });
  }
}
