import { AuthType } from '@ice/plugin-auth/types';
import { useAuth } from 'ice';

const NODE_ENV = process.env.NODE_ENV ?? '';

export default (props: {
  children: any;
  authKey: string | string[];
  keyAndOr?: 'and' | 'or';
  fallback?: any;
}) => {
  const keyAndOr = props.keyAndOr || 'and';
  let isTrue = keyAndOr !== 'or';
  if (Array.isArray(props.authKey)) {
    for (let i in props.authKey) {
      if (keyAndOr === 'and') {
        if (!checkAuth(props.authKey[i])) {
          isTrue = false;
          break;
        }
      } else if (keyAndOr === 'or') {
        if (checkAuth(props.authKey[i])) {
          isTrue = true;
          break;
        }
      }
    }
  } else {
    isTrue = checkAuth(props.authKey);
  }

  return isTrue ? props.children : props.fallback || '';
};

/**
 * 如果遇到hook问题 可以在外部传入auth
 * @param authKey
 * @param auth
 * @returns
 */
export const checkAuth = (authKey: string, auth?: AuthType) => {
  if (!auth) {
    [auth] = useAuth();
  }

  return NODE_ENV === 'development' || auth[authKey];
};
