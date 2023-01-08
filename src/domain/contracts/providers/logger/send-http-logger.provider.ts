export namespace SendHttpLoggerProviderDTO {
  export type Parameters = Readonly<{
    message: string | unknown;
  }>;
  export type Result = void;
}

export interface ISendHttpLoggerProvider {
  http(parameters: SendHttpLoggerProviderDTO.Parameters): SendHttpLoggerProviderDTO.Result;
}
