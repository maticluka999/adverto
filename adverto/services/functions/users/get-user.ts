import { APIGatewayEvent } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { cognitoUserToUserDto } from 'functions/utils/mappers';

export async function handler(event: APIGatewayEvent) {
  const sub = event.pathParameters!.sub;
  const provider = new CognitoIdentityServiceProvider();

  var params = {
    Filter: `sub = "${sub}"`,
    UserPoolId: process.env.USER_POOL_ID!,
  };

  const response = await provider.listUsers(params).promise();

  if (!response.Users) {
    return { statusCode: 400, body: "User doesn't exist." };
  }

  const user = response.Users![0]; // we only fetch only one user (on index 0)
  const dto = cognitoUserToUserDto(user);

  return { statusCode: 200, body: JSON.stringify(dto) };
}
