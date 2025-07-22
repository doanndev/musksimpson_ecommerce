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

export interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const checkGoogle = setInterval(() => {
      if (window.google) {
        clearInterval(checkGoogle);
        resolve();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkGoogle);
      reject(new Error('Google SDK failed to load'));
    }, 10000);
  });
};

export const initializeFacebookAuth = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.FB) {
      resolve();
      return;
    }

    const checkFB = setInterval(() => {
      if (window.FB) {
        clearInterval(checkFB);
        resolve();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkFB);
      reject(new Error('Facebook SDK failed to load'));
    }, 10000);
  });
};
