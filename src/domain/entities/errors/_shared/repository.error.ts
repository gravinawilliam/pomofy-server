import { StatusError } from './status.error';

type ParametersConstructorDTO = {
  error?: Error;
  repository: {
    name: RepositoryNames;
    method: UsersRepositoryMethods | EmailValidationTokensRepositoryMethods | TasksRepositoryMethods;
    externalName?: string;
  };
};

export enum RepositoryNames {
  USERS = 'users',
  TASKS = 'tasks',
  EMAIL_VALIDATION_TOKENS = 'email validation tokens'
}

export enum EmailValidationTokensRepositoryMethods {
  SAVE = 'save'
}

export enum TasksRepositoryMethods {
  SAVE = 'save',
  FIND = 'find',
  FIND_BY_ID = 'find by id',
  UPDATE = 'update'
}

export enum UsersRepositoryMethods {
  FIND_BY_EMAIL = 'find by email',
  FIND_BY_ID = 'find by id',
  FIND_BY_USERNAME = 'find by username',
  SAVE = 'save',
  SAVE_WITH_FACEBOOK_ACCOUNT = 'save with facebook account',
  SAVE_WITH_GOOGLE_ACCOUNT = 'save with google account',
  UPDATE = 'update'
}

export class RepositoryError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'RepositoryError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'RepositoryError';
    this.message = `Error in ${parameters.repository.name} repository in ${parameters.repository.method} method.${
      parameters.repository.externalName === undefined
        ? ''
        : ` Error in external provider name: ${parameters.repository.externalName}.`
    }`;
    this.status = StatusError.REPOSITORY_ERROR;
    this.error = parameters.error;
  }
}
