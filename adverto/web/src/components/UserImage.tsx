import defaultProfilePicture from './../assets/images/default-profile-picture.png';

type Props = {
  src?: string;
  width: number;
  height: number;
};

function UserImage({ src, width, height }: Props) {
  return (
    <img
      className='rounded-full border-2'
      src={src ? src : defaultProfilePicture}
      alt=''
      referrerPolicy='no-referrer'
      width={width}
      height={height}
    />
  );
}

export default UserImage;
