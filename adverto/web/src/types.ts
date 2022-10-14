export enum PreferredMFA {
  NO_MFA = 'NOMFA',
  SMS = 'SMS_MFA',
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

export enum RoleName {
  ADVERTISER = 'advertiser',
  ADMIN = 'admin',
}

export type Role = {
  name: RoleName;
  arn: string;
};

export class User {
  attributes: UserAttributes;
  roles: Role[];

  constructor(attributes: UserAttributes, roles: Role[]) {
    this.attributes = attributes;
    this.roles = roles;
  }

  isAdmin() {
    return !!this.roles.find((r) => r.name === RoleName.ADMIN);
  }

  isAdvertiser() {
    return !!this.roles.find((r) => r.name === RoleName.ADMIN);
  }

  getRoleArnByRoleName(roleName: RoleName) {
    const role = this.roles.find((r) => r.name === roleName);

    if (role) {
      return role.arn;
    } else {
      throw new Error('User has no such role');
    }
  }
}

export type AdvertiserDto = {
  sub: string;
  email: string;
  givenName: string;
  familyName: string;
  picture?: string;
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
