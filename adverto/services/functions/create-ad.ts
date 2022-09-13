import { APIGatewayEvent } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import * as yup from 'yup';

function extractIdentityIdFromEvent(event: APIGatewayEvent) {
  const authorizer = event.requestContext.authorizer!;
  return authorizer.iam.cognitoIdentity.identityId;
}

function extractSubFromEvent(event: APIGatewayEvent) {
  const authorizer = event.requestContext.authorizer!;
  return authorizer.iam.cognitoIdentity.amr[2].split('CognitoSignIn:')[1];
}

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  text: yup.string().required('Text is required'),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Price is required'),
  imageContentType: yup
    .string()
    .oneOf(['image/png', 'image/jpg', 'image/jpeg']),
});

export const handler = async (event: APIGatewayEvent) => {
  const parsedBody = JSON.parse(event.body!);

  // validation

  try {
    await validationSchema.validate(parsedBody);
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ type: error.name, message: error.message }),
    };
  }

  const { title, text, price, imageContentType } = parsedBody;

  // presigned url
  const id = randomUUID();
  let presignedPostData = undefined;

  if (imageContentType) {
    var s3 = new S3({ region: process.env.REGION });

    const advertiserIdentityId = extractIdentityIdFromEvent(event);

    const extension = imageContentType.split('/')[1];

    const presignedPostParams: S3.PresignedPost.Params = {
      Bucket: process.env.BUCKET_NAME,
      Fields: {
        key: `${advertiserIdentityId}/ads/${id}.${extension}`,
      },
      Conditions: [['eq', '$Content-Type', imageContentType]],
      Expires: 100,
    };

    presignedPostData = s3.createPresignedPost(presignedPostParams);
  }

  const client = new aws.DynamoDB.DocumentClient();
  const params: aws.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      pk: extractSubFromEvent(event),
      sk: id,
      gsi1pk: 'ad',
      gsi1sk: Date.now(),
      title,
      text,
      price,
      imageUrl: imageContentType
        ? `${presignedPostData!.url}/${presignedPostData!.fields.key}`
        : undefined,
    },
  };

  try {
    await client.put(params).promise();
  } catch (e: any) {
    console.log(e);
    return {
      statusCode: 500,
      body: 'An error occurred.',
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ad: {
        id: params.Item.sk,
        title: params.Item.title,
        text: params.Item.text,
        price: params.Item.price,
        createdAt: params.Item.gsi1sk,
        imageUrl: params.Item.imageUrl,
      },
      presignedPostData,
    }),
  };
};

function getPresignedPostURL(imageContentType: string) {}
