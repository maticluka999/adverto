export type Ad = {
  pk: string; // advertiserUsername (uuid)
  sk: string; // ad#id (uuid)
  gsi1pk: 'ad'; // we need this to query ads sorted by date created
  gsi1sk: number; // createdAt (timestamp)
  title: string;
  text: string;
};

export type AdDto = {
  id: string;
  createdAt: number; // timestamp
  title: string;
  text: string;
  price: number;
  advertiser: AdvertiserDto;
};

export type AdvertiserDto = {
  sub: string;
  email: string;
  givenName: string;
  familyName: string;
  profilePicture: string;
};
