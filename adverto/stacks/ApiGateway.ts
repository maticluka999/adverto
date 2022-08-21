import { StackContext, Api } from '@serverless-stack/resources';

export function ApiGateway({ stack }: StackContext) {
  const api = new Api(stack, 'api', {
    routes: {
      'GET /': 'functions/lambda.handler',
    },
  });
  stack.addOutputs({
    API_URL: api.url,
  });

  return api;
}
