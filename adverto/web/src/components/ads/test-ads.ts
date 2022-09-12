import { Ad } from '../../types';

const ad1: Ad = {
  id: '1',
  advertiserId: '1',
  title: 'Ad 1',
  text: 'This is ad 1',
  price: 200,
  imageUrl:
    'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/download-23.jpg',
  createdAt: new Date(2022, 4, 27).getTime(),
  advertiser: {
    sub: '1',
    givenName: 'John',
    familyName: 'Doe',
    picture: '',
    email: 'johndoe@example.com',
  },
};

const ad2: Ad = {
  id: '2',
  advertiserId: '2',
  title: 'Ad 2',
  text: 'This is ad 2',
  price: 200,
  imageUrl: '',
  createdAt: new Date(2022, 4, 27).getTime(),
  advertiser: {
    sub: '2',
    givenName: 'John',
    familyName: 'Doe',
    picture: '',
    email: 'johndoe@example.com',
  },
};

const ad3: Ad = {
  id: '3',
  advertiserId: '1',
  title: 'Ad 3',
  text: 'This is ad 3',
  price: 200,
  imageUrl:
    'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/download-23.jpg',
  createdAt: new Date(2022, 4, 27).getTime(),
  advertiser: {
    sub: '1',
    givenName: 'John',
    familyName: 'Doe',
    picture: '',
    email: 'johndoe@example.com',
  },
};

const ad4: Ad = {
  id: '4',
  advertiserId: '1',
  title: 'Ad 4',
  text: 'This is ad 4',
  price: 200,
  imageUrl: '',
  createdAt: new Date(2022, 4, 27).getTime(),
  advertiser: {
    sub: '1',
    givenName: 'John',
    familyName: 'Doe',
    picture: '',
    email: 'johndoe@example.com',
  },
};

export const testAds = [ad1, ad2, ad3, ad4];
