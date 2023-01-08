import crypto from 'crypto';

import { ISendEmailProvider } from '@contracts/providers/email/send.email-provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';
import { ISaveEmailValidationTokensRepository } from '@contracts/repositories/email-validation-tokens/save.email-validation-tokens-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either, failure, success } from '@shared/utils/either.util';

import { UseCase } from '@domain/use-cases/_shared/use-case';

export class SendEmailValidationTokenUseCase extends UseCase<
  SendEmailValidationTokenUseCaseDTO.Parameters,
  SendEmailValidationTokenUseCaseDTO.Result
> {
  constructor(
    loggerProvider: ISendInfoLoggerProvider,
    private readonly saveEmailValidationTokensRepository: ISaveEmailValidationTokensRepository,
    private readonly emailProvider: ISendEmailProvider
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: SendEmailValidationTokenUseCaseDTO.Parameters
  ): SendEmailValidationTokenUseCaseDTO.Result {
    const token = crypto.randomUUID().slice(0, 4);

    const resultSaveToken = await this.saveEmailValidationTokensRepository.save({
      token,
      user: { id: parameters.user.id }
    });
    if (resultSaveToken.isFailure()) return failure(resultSaveToken.value);

    const resultSendEmail = await this.emailProvider.send({
      emailTemplate: { slug: 'email-validation-token' },
      to: [{ email: parameters.user.email, name: parameters.user.username.value }],
      variables: { token }
    });
    if (resultSendEmail.isFailure()) return failure(resultSendEmail.value);

    return success({ user: { id: parameters.user.id } });
  }
}

export namespace SendEmailValidationTokenUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id' | 'email' | 'username'>;
  }>;

  type ResultError = ProviderError | RepositoryError;
  type ResultSuccess = Readonly<{
    user: Pick<User, 'id'>;
  }>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
