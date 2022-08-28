export type Advertiser = {
  pk: string; // username (uuid)
  sk: 'info';
  givenName: string;
  familyName: string;
  email: string;
  profilePicture: string;
};

export type Ad = {
  pk: string; // advertiserUsername (uuid)
  sk: string; // ad#id (uuid)
  gsi1pk: 'ad'; // we need this to query ads sorted by date created
  gsi1sk: number; // createdAt (timestamp)
  title: string;
  text: string;
};
