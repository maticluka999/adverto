import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Ad, AdvertiserDto, AdDto } from './model';

export function adToAdDto(ad: Ad, advertiser?: AdvertiserDto): AdDto {
  return {
    id: ad.sk,
    title: ad.title,
    text: ad.text,
    price: ad.price,
    createdAt: ad.gsi1sk,
    imageUrl: ad.imageUrl,
    advertiser,
  };
}

export function cognitoUserToAdvertiserDto(
  user: CognitoIdentityServiceProvider.UserType
): AdvertiserDto {
  return {
    sub: user.Attributes!.find((item) => item.Name === 'sub')!['Value']!,
    email: user.Attributes!.find((item) => item.Name === 'email')!['Value']!,
    givenName: user.Attributes!.find((item) => item.Name === 'given_name')![
      'Value'
    ]!,
    familyName: user.Attributes!.find((item) => item.Name === 'family_name')![
      'Value'
    ]!,
    picture: user.Attributes!.find((item) => item.Name === 'picture')?.[
      'Value'
    ],
  };
}
