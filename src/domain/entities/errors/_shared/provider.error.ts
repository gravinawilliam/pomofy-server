import { StatusError } from './status.error';

type ParametersConstructorDTO = {
  error?: Error;
  provider: {
    name: ProviderNames;
    method:
      | PasswordProviderMethods
      | EmailProviderMethods
      | CryptoProviderMethods
      | TokenProviderMethods
      | HttpClientProviderMethods
      | GoogleApiProviderMethods;
    externalName?: string;
  };
};

export enum ProviderNames {
  PASSWORD = 'password',
  EMAIL = 'email',
  CRYPTO = 'crypto',
  TOKEN = 'token',
  HTTP_CLIENT = 'http client',
  GOOGLE_API = 'google api'
}

export enum HttpClientProviderMethods {
  GET = 'get'
}

export enum GoogleApiProviderMethods {
  LOAD_USER = 'loadUser'
}

export enum PasswordProviderMethods {
  ENCRYPT = 'encrypt',
  COMPARE = 'compare'
}

export enum EmailProviderMethods {
  VALIDATE = 'validate',
  SEND = 'send'
}

export enum TokenProviderMethods {
  GENERATE_JWT = 'generate jwt'
}

export enum CryptoProviderMethods {
  GENERATE_ID = 'generate id'
}

export class ProviderError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'ProviderError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'ProviderError';
    this.message = `Error in ${parameters.provider.name} provider in ${parameters.provider.method} method.${
      parameters.provider.externalName === undefined
        ? ''
        : ` Error in external provider name: ${parameters.provider.externalName}.`
    }`;
    this.status = StatusError.PROVIDER_ERROR;
    this.error = parameters.error;
  }
}
