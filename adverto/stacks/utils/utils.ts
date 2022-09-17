import { Stack } from '@serverless-stack/resources';

export function generateExecuteApiRoot(stack: Stack, httpApiId: string) {
  return `arn:aws:execute-api:${stack.region}:${stack.account}:${httpApiId}/*`;
}
