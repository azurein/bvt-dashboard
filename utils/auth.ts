import Cookies from 'js-cookie';

export const signOut = () => {
  Cookies.remove('accessToken');
};
