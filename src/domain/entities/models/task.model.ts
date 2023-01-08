import { User } from '@models/user.model';

import { Id } from '@value-objects/id.value-object';

export enum TaskStatus {
  PENDING = 'PENDING',
  NOT_STATUS = 'NOT_STATUS',
  COMPLETED = 'COMPLETED'
}

export class Task {
  id: Id;

  name: string;

  status: TaskStatus;

  user: Pick<User, 'id'>;

  constructor(parameters: { id: Id; name: string; status: TaskStatus; user: Pick<User, 'id'> }) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.status = parameters.status;
    this.user = parameters.user;
  }

  public static selectTaskStatus(status: string): TaskStatus {
    switch (status.toUpperCase()) {
      case 'PENDING': {
        return TaskStatus.PENDING;
      }
      case 'COMPLETED': {
        return TaskStatus.COMPLETED;
      }
      default: {
        {
          return TaskStatus.NOT_STATUS;
        }
      }
    }
  }
}
