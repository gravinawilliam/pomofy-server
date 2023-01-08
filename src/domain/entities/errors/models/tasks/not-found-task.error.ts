import { StatusError } from '@errors/_shared/status.error';

import { Id } from '@value-objects/id.value-object';

type ParametersConstructorDTO = {
  task: { id: Id };
};

export class NotFoundTaskError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'NotFoundTaskError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Not found task by id ${parameters.task.id.value}`;
    this.name = 'NotFoundTaskError';
    this.status = StatusError.NOT_FOUND;
  }
}
