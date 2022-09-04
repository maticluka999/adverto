import { StandardAttributesMask } from 'aws-cdk-lib/aws-cognito';

const standardCognitoWriteAttributes: StandardAttributesMask = {
  givenName: true,
  familyName: true,
  email: true,
  // emailVerified: true,
  // address: true,
  // birthdate: true,
  // gender: true,
  // locale: true,
  // middleName: true,
  // fullname: true,
  // nickname: true,
  phoneNumber: true,
  // phoneNumberVerified: true,
  profilePicture: true,
  // preferredUsername: true,
  // profilePage: true,
  // timezone: true,
  // lastUpdateTime: true,
  // website: true,
};

export default standardCognitoWriteAttributes;
