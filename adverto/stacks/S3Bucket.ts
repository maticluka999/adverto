import { StackContext } from '@serverless-stack/resources';
import { AnyPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import constants from './constants';

export function S3Bucket({ stack }: StackContext) {
  const bucket = new Bucket(stack, 'bucket', {
    bucketName: `${stack.stage}-${constants.APP_NAME}-bucket`,
    blockPublicAccess: {
      blockPublicAcls: false,
      ignorePublicAcls: false,
      blockPublicPolicy: false,
      restrictPublicBuckets: false,
    },
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
