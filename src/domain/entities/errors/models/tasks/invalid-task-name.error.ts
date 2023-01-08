import { StatusError } from '@errors/_shared/status.error';

type ParametersConstructorDTO = {
  taskName: string;
};

export class InvalidTaskNameError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidTaskNameError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Invalid task name ${parameters.taskName}`;
    this.name = 'InvalidTaskNameError';
    this.status = StatusError.INVALID;
  }
}
