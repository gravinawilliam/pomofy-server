import { performance } from 'perf_hooks';

import { ISendErrorLoggerProvider } from '@contracts/providers/logger/send-error-logger.provider';
import { ISendInfoLoggerProvider } from '@contracts/providers/logger/send-info-logger.provider';

import { Either } from '@shared/utils/either.util';
import { HttpStatusCode } from '@shared/utils/http-status-code.util';

import { StatusError } from '@domain/entities/errors/_shared/status.error';

export interface IValidator {
  validate(): Either<ResponseError, undefined>;
}

export type HttpResponse<DATA> = {
  statusCode: number;
  data: DATA;
};

export type HttpRequest<Body = any, Query = any> = {
  body: Body;
  query: Query;
  access_token: string;
};

export enum StatusSuccess {
  CREATED = 'created',
  DONE = 'done'
}

export type ResponseSuccess<Data = any> = {
  data: Data;
  status: StatusSuccess;
};

export type ResponseError = {
  message: string;
  status: StatusError;
};

export abstract class Controller<Parameters, Response> {
  constructor(private readonly loggerProvider: ISendInfoLoggerProvider & ISendErrorLoggerProvider) {}

  public async handle(parameters: Parameters): Promise<HttpResponse<any>> {
    try {
      const startTime = performance.now();

      const response = (await this.performOperation(parameters)) as Either<ResponseError, ResponseSuccess>;
      if (response.isFailure()) {
        this.log({ httpRequest: parameters, startTime });
        return this.makeResponseError(response.value as ResponseError);
      }

      this.log({ httpRequest: parameters, startTime });
      return this.makeResponseGood(response.value as ResponseSuccess);
    } catch (error) {
      this.loggerProvider.error({
        message: `${this.constructor.name}.execute(${parameters}) error`,
        value: error
      });

      return {
        statusCode: 500,
        data: error
      };
    }
  }

  private log(parameters: { httpRequest: Parameters; startTime: number }) {
    this.loggerProvider.info({
      message: `${this.constructor.name}.execute(${parameters.httpRequest}) took +${
        performance.now() - parameters.startTime
      } ms to execute!`
    });
  }

  private makeResponseError(error: ResponseError): HttpResponse<any> {
    const statusCode = this.selectStatusCode({ status: error.status });
    return { statusCode, data: { error: error.message } };
  }

  private makeResponseGood(response: ResponseSuccess): HttpResponse<any> {
    const statusCode = this.selectStatusCode({ status: response.status });
    return { statusCode, data: response.data };
  }

  private selectStatusCode(parameters: { status: StatusError | StatusSuccess }): number {
    switch (parameters.status) {
      case StatusError.CONFLICT: {
        return HttpStatusCode.CONFLICT;
      }
      case StatusError.INVALID: {
        return HttpStatusCode.BAD_REQUEST;
      }
      case StatusError.NOT_FOUND: {
        return HttpStatusCode.NOT_FOUND;
      }
      case StatusError.PROVIDER_ERROR: {
        return HttpStatusCode.INTERNAL_SERVER_ERROR;
      }
      case StatusError.REPOSITORY_ERROR: {
        return HttpStatusCode.INTERNAL_SERVER_ERROR;
      }
      case StatusError.UNAUTHORIZED: {
        return HttpStatusCode.UNAUTHORIZED;
      }
      case StatusSuccess.CREATED: {
        return HttpStatusCode.CREATED;
      }
      case StatusSuccess.DONE: {
        return HttpStatusCode.OK;
      }
    }
  }

  protected abstract performOperation(parameters: Parameters): Response;
}
