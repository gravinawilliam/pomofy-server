import { StatusError } from '@errors/_shared/status.error';

type ParametersConstructorDTO = {
  motive: InvalidUsernameMotive;
};

export enum InvalidUsernameMotive {
  IS_BLANK = 'is blank',
  IS_LESS_THAN_3_CHARACTERS = 'is less than 3 characters',
  HAS_MORE_THAN_ONE_WORD = 'has more than one word',
  IS_MORE_THAN_22_CHARACTERS = 'is more than 22 characters',
  INVALID_CHARACTERS = 'invalid characters',
  ALREADY_EXISTS = 'already exists'
}

export class InvalidUsernameError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidUsernameError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidUsernameError';
    this.message = `Invalid username because ${parameters.motive}.`;
    this.status = StatusError.INVALID;
  }
}
