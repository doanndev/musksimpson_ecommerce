import { type Namespace, createNamespace } from 'cls-hooked';
import type { AuthRequest } from '~/libs/types/common.types';

const namespaceName = 'request-context';
const namespace: Namespace = createNamespace(namespaceName);

export const setRequestUser = (user: AuthRequest['user']) => {
  namespace.set('user', user);
};

export const getRequestUser = (): AuthRequest['user'] | undefined => {
  return namespace.get('user');
};

export const setRequestIP = (ip: string) => {
  namespace.set('ip', ip);
};

export const getRequestIP = (): string => {
  return namespace.get('ip') || '';
};

export const setRequestLocation = (location: any) => {
  namespace.set('location', location);
};

export const getRequestLocation = (): any | undefined => {
  return namespace.get('location');
};

export const runWithRequestContext = (fn: () => void) => {
  namespace.run(() => {
    fn();
  });
};
