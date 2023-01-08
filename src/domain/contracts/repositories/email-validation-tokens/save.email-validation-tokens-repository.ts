import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveEmailValidationTokensRepositoryDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    token: string;
  }>;

  export type ResultError = RepositoryError | ProviderError;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface ISaveEmailValidationTokensRepository {
  save(parameters: SaveEmailValidationTokensRepositoryDTO.Parameters): SaveEmailValidationTokensRepositoryDTO.Result;
}
