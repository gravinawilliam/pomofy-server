import { ILoadUserFacebookApiProvider } from '@contracts/providers/facebook-api/load-user.facebook-api-provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { IFindByEmailUsersRepository } from '@contracts/repositories/users/find-by-email.users-repository';
import { ISaveWithFacebookAccountUsersRepository } from '@contracts/repositories/users/save-with-facebook-account.users-repository';
import { IUpdateUsersRepository } from '@contracts/repositories/users/update.users-repository';

import { Either, failure, success } from '@shared/utils/either.util';

import { ProviderError } from '@domain/entities/errors/_shared/provider.error';
import { RepositoryError } from '@domain/entities/errors/_shared/repository.error';
import { User } from '@domain/entities/models/user.model';
import { Username } from '@domain/entities/value-objects/username.value-object';
import { UseCase } from '@domain/use-cases/_shared/use-case';

export class FacebookSignInUseCase extends UseCase<FacebookSignInUseCaseDTO.Parameters, FacebookSignInUseCaseDTO.Result> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider,
    private readonly facebookApi: ILoadUserFacebookApiProvider,
    private readonly usersRepository: IFindByEmailUsersRepository &
      ISaveWithFacebookAccountUsersRepository &
      IUpdateUsersRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: FacebookSignInUseCaseDTO.Parameters): FacebookSignInUseCaseDTO.Result {
    const resultLoadFacebookUser = await this.facebookApi.loadUser({
      accessToken: parameters.facebookAccessToken
    });
    if (resultLoadFacebookUser.isFailure()) return failure(resultLoadFacebookUser.value);
    const { facebookAccount } = resultLoadFacebookUser.value;

    const resultFindUserByEmail = await this.usersRepository.findByEmail({
      email: facebookAccount.email
    });
    if (resultFindUserByEmail.isFailure()) return failure(resultFindUserByEmail.value);
    const { user: foundUser } = resultFindUserByEmail.value;

    if (foundUser === undefined) {
      const resultSaveWithFacebookAccount = await this.usersRepository.saveWithFacebookAccount({
        email: facebookAccount.email,
        facebookAccountId: facebookAccount.id.value,
        isEmailValidated: true,
        username: Username.generate({ name: facebookAccount.name })
      });
      if (resultSaveWithFacebookAccount.isFailure()) {
        return failure(resultSaveWithFacebookAccount.value);
      }
      const { user } = resultSaveWithFacebookAccount.value;
      return success({ user: { id: user.id } });
    }

    if (foundUser.facebookAccount !== undefined) return success({ user: { id: foundUser.id } });

    const resultSaveWithFacebookAccount = await this.usersRepository.update({
      user: {
        id: foundUser.id,
        facebookAccount: {
          id: facebookAccount.id
        }
      }
    });
    if (resultSaveWithFacebookAccount.isFailure()) return failure(resultSaveWithFacebookAccount.value);

    return success({ user: { id: foundUser.id } });
  }
}

export namespace FacebookSignInUseCaseDTO {
  export type Parameters = Readonly<{
    facebookAccessToken: string;
  }>;

  type ResultError = RepositoryError | ProviderError;
  type ResultSuccess = Readonly<{ user: Pick<User, 'id'> }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
