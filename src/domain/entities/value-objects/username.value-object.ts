import { InvalidUsernameError, InvalidUsernameMotive } from '@errors/value-objects/invalid-username.error';

import { Either, failure, success } from '@shared/utils/either.util';

export class Username {
  public readonly value: string;

  constructor(parameters: { username: string }) {
    this.value = parameters.username;
    Object.freeze(this);
  }

  public static generate(parameters: { name: string }): Username {
    return new Username({
      username: `${parameters.name.trim().toLowerCase()}${Math.random()}`
    });
  }

  public static validate(parameters: {
    username: string;
  }): Either<InvalidUsernameError, { usernameValidated: Username }> {
    const usernameFormated = parameters.username.trim().toLowerCase();

    if (usernameFormated.includes('@')) {
      return failure(
        new InvalidUsernameError({
          motive: InvalidUsernameMotive.INVALID_CHARACTERS
        })
      );
    }
    if (usernameFormated === '' || usernameFormated.length === 0) {
      return failure(
        new InvalidUsernameError({
          motive: InvalidUsernameMotive.IS_BLANK
        })
      );
    }
    if (usernameFormated.length < 3) {
      return failure(
        new InvalidUsernameError({
          motive: InvalidUsernameMotive.IS_LESS_THAN_3_CHARACTERS
        })
      );
    }
    if (usernameFormated.split(' ').length > 1) {
      return failure(
        new InvalidUsernameError({
          motive: InvalidUsernameMotive.HAS_MORE_THAN_ONE_WORD
        })
      );
    }
    if (usernameFormated.length > 22) {
      return failure(
        new InvalidUsernameError({
          motive: InvalidUsernameMotive.IS_MORE_THAN_22_CHARACTERS
        })
      );
    }

    return success({ usernameValidated: new Username({ username: usernameFormated }) });
  }
}
