export interface FacebookAuthConfig {
  appId: string;
  cookie?: boolean;
  xfbml?: boolean;
  version?: string;
  status?: boolean;
  autoLogAppEvents?: boolean;
  [key: string]: any;
}

export interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
    grantedScopes?: string;
    [key: string]: any;
  } | null;
  status: 'connected' | 'not_authorized' | 'unknown';
}

export interface FacebookUIParams {
  method: 'share' | 'feed' | 'apprequests' | 'send' | string;
  href?: string;
  link?: string;
  to?: string | string[];
  picture?: string;
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  [key: string]: any;
}

export interface GoogleAuthConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
  [key: string]: any;
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleAuthConfig) => void;
          renderButton: (element: HTMLElement, config: { theme?: string; size?: string; [key: string]: any }) => void;
          prompt: () => void;
        };
      };
    };
    FB?: {
      init: (config: FacebookAuthConfig) => void;
      login: (
        callback: (response: FacebookAuthResponse) => void,
        options?: { scope?: string; return_scopes?: boolean; auth_type?: string; [key: string]: any }
      ) => void;
      getLoginStatus: (callback: (response: FacebookAuthResponse) => void, force?: boolean) => void;
      logout: (callback: (response: FacebookAuthResponse) => void) => void;
      api: (path: string, params?: { [key: string]: any }, callback?: (response: any) => void) => void;
      ui: (params: FacebookUIParams, callback?: (response: any) => void) => void;
      Event: {
        subscribe: (event: string, callback: (response: any) => void) => void;
        unsubscribe: (event: string, callback: (response: any) => void) => void;
      };
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
      getAuthResponse: () => FacebookAuthResponse['authResponse'];
      AppEvents: {
        logEvent: (eventName: string, valueToSum?: number, parameters?: { [key: string]: any }) => void;
      };
    };
  }
}

export {};
