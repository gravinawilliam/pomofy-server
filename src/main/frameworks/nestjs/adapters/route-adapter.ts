import { Controller, HttpRequest } from '@application/rest/_shared/controller.util';

export const adapterRoute = (controller: Controller<any, any>) => {
  return async (parameters: { body: any; response: any; authToken?: string; request: any }) => {
    const httpRequest: HttpRequest<any, any> = {
      body: parameters.body,
      query: parameters.request.query,
      access_token: parameters.authToken === undefined ? '' : parameters.authToken.split(' ')[1]
    };

    const { data, statusCode } = await controller.handle(httpRequest);

    parameters.response.status(statusCode).send(data);
  };
};
