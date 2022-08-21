export type Advertiser = {
  pk: string; // ADVERTISER#username (uuid)
  sk: 'info';
  givenName: string;
  familyName: string;
  email: string;
};

export type Ad = {
  pk: string; // advertiserUsername (uuid)
  sk: string; // AD#id (uuid)
  title: string;
  text: string;
};
