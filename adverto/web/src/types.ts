export enum PreferredMFA {
  NO_MFA = 'NOMFA',
  SMS = 'SMSMFA',
}

export type UserAttributes = {
  sub: string;
  email: string;
  givenName: string;
  familyName: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  picture: string;
};

export type User = {
  attributes: UserAttributes;
  preferredMFA: PreferredMFA;
};

export type AdvertiserDto = {
  sub: string;
  givenName: string;
  familyName: string;
  picture: string;
  email: string;
};

export type Ad = {
  id: string;
  title: string;
  text: string;
  price: number;
  imageUrl: string;
  createdAt: number; // timestamp
  advertiser: AdvertiserDto;
};

export enum ActionColor {
  BLACK,
  RED,
}

export type Action = {
  name: string;
  execute: (params?: any) => void;
  color?: ActionColor;
  setFetching: (fetching: boolean) => void;
};
