import { StatusError } from '@errors/_shared/status.error';

type ParametersConstructorDTO = {
  motive: UserSignInMotive;
};

export enum UserSignInMotive {
  EMAIL_NOT_FOUND = 'email not found',
  USERNAME_NOT_FOUND = 'username not found',
  PASSWORD_NOT_MATCH = 'password not match',
  USER_NOT_FOUND = 'user not found'
}

export class UserSignInError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'UserSignInError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Error user sign in because ${parameters.motive}.`;
    this.name = 'UserSignInError';
    this.status = this.selectStatus(parameters);
  }

  private selectStatus(parameters: ParametersConstructorDTO): StatusError {
    return parameters.motive === UserSignInMotive.EMAIL_NOT_FOUND ||
      parameters.motive === UserSignInMotive.USERNAME_NOT_FOUND ||
      parameters.motive === UserSignInMotive.USER_NOT_FOUND
      ? StatusError.NOT_FOUND
      : StatusError.INVALID;
  }
}
