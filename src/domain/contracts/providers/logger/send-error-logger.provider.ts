export namespace SendErrorLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string;
    value: string | Error | unknown;
  }>;
  export type Result = void;
}

export interface ISendErrorLoggerProvider {
  error(parameters: SendErrorLoggerProviderDTO.Parameters): SendErrorLoggerProviderDTO.Result;
}
