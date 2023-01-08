import { StatusError } from '@errors/_shared/status.error';

type ParametersConstructorDTO = {
  taskStatus: string;
};

export class InvalidTaskStatusError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidTaskStatusError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Invalid task status ${parameters.taskStatus}`;
    this.name = 'InvalidTaskStatusError';
    this.status = StatusError.INVALID;
  }
}
