import { StackContext } from '@serverless-stack/resources';
import { AnyPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';

export function S3Bucket({ stack }: StackContext) {
  const bucket = new Bucket(stack, 'bucket', {
    cors: [
      {
        allowedMethods: [HttpMethods.PUT, HttpMethods.POST],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      },
    ],
  });

  bucket.addToResourcePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new AnyPrincipal()],
    })
  );

  return bucket;
}
