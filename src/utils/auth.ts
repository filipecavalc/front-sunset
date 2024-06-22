import cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  exp: number;
  username: string;
  role: string;
}

export const setToken = (token: string) => {
  cookie.set('token', token, { expires: 1 }); // 1 day
};

export const getToken = (): string | undefined => {
  return cookie.get('token');
};

export const removeToken = () => {
  cookie.remove('token');
};

export const getUser = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};
