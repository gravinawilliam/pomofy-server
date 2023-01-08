import { StatusError } from '@errors/_shared/status.error';

type ParametersConstructorDTO = {
  motive: InvalidEmailMotive;
};

export enum InvalidEmailMotive {
  IS_BLANK = 'is blank',
  IS_GREATER_THAN_THE_MAXIMUM_ALLOWED = 'is greater than the maximum allowed',
  IS_INVALID = 'is invalid',
  LOCAL_IS_BLANK = 'local is blank',
  DOMAIN_IS_BLANK = 'domain is blank',
  LOCAL_IS_GREATER_THAN_THE_MAXIMUM_ALLOWED = 'local is greater than the maximum allowed',
  DOMAIN_IS_GREATER_THAN_THE_MAXIMUM_ALLOWED = 'domain is greater than the maximum allowed',
  DOMAIN_WITH_A_PART_LARGER_THAN_63_CHARACTERS = 'domain with a part larger than 63 characters',
  ALREADY_EXISTS = 'already exists'
}

export class InvalidEmailError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidEmailError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidEmailError';
    this.message = `Invalid email because ${parameters.motive}.`;
    this.status = StatusError.INVALID;
  }
}
