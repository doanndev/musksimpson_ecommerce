import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useSocialLoginMutation,
} from "@/api/auth/query";
import { getCurrentUserRequest } from "@/api/user/request";
import type { UserResponseData } from "@/api/user/type";
import { auth } from "@/config/firebase";
import { RoleEnum } from "@/lib/constants/role";
import { ROUTES } from "@/lib/routes";
import { onMutateError } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useMutation } from "@tanstack/react-query";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useAuthAdmin = () => {
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();
  const { clearCheckoutData } = useCheckoutStore();

  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  });

  const { mutate: getCurrentUser } = useMutation({
    mutationFn: getCurrentUserRequest,
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);

      if (data.roles === RoleEnum.ADMIN || data.roles === RoleEnum.SELLER) {
        router.push(ROUTES.ADMIN_HOME);
        toast.success("Login successfully");
      } else {
        router.push(ROUTES.HOME);
        toast.error(
          "Access denied: Only Admin and Seller can access the admin panel."
        );
      }
    },
  });

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       getCurrentUser();
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [getCurrentUser]);

  const handleSetAuth = useCallback((token: string, refreshToken: string) => {
    if (!token || !refreshToken) return;

    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setRefreshToken(refreshToken);
    getCurrentUser();
  }, []);

  const { mutate: login, isPending: loginLoading } = useLoginMutation({
    onSuccess: (data) => {
      handleSetAuth(data.token!, data.refreshToken!);
    },
    onError: onMutateError,
  });

  const { mutate: socialLogin } = useSocialLoginMutation({
    onSuccess: (data) => {
      handleSetAuth(data.token!, data.refreshToken!);
    },
    onSettled: () => {
      setSocialLoading({ google: false, facebook: false });
    },
    onError: onMutateError,
  });

  const { mutate: register, isPending: registerLoading } = useRegisterMutation({
    onSuccess: (data) => {
      handleSetAuth(data.token!, data.refreshToken!);
    },
    onError: onMutateError,
  });

  const { mutate: logout, isPending: logoutLoading } = useLogoutMutation({
    onSuccess: () => {
      clearAuth();
      clearCheckoutData();
      router.push(ROUTES.ADMIN_LOGIN);
      toast.success("Logout successfully");
    },
    onError: onMutateError,
  });

  const handleGoogleLogin = useCallback(async () => {
    setSocialLoading({ google: true, facebook: false });
    try {
      const provider = new GoogleAuthProvider();
      const firebaseUser = await signInWithPopup(auth, provider);
      const user = firebaseUser.user;
      socialLogin({
        email: user.email || "",
        fullName: user.displayName || "",
        avatar: user.photoURL || "",
        provider: "google",
        providerId: user.uid,
      });
    } catch (error) {
      setSocialLoading({ google: false, facebook: false });
      toast.error("Google login failed");
    }
  }, [socialLogin]);

  const handleFacebookLogin = useCallback(async () => {
    setSocialLoading({ google: false, facebook: true });
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope("public_profile,email");
      const firebaseUser = await signInWithPopup(auth, provider);
      const user = firebaseUser.user;
      socialLogin({
        email: user.email || "",
        fullName: user.displayName || "",
        avatar: user.photoURL || "",
        provider: "facebook",
        providerId: user.uid,
      });
    } catch (error) {
      setSocialLoading({ google: false, facebook: false });
      toast.error("Facebook login failed");
    }
  }, [socialLogin, router]);

  const handleSetUserData = useCallback(
    (user: UserResponseData, token: string) => {
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setToken(token);
    },
    []
  );

  return {
    user,
    isAuthenticated:
      !!user &&
      !!token &&
      (user.roles === RoleEnum.ADMIN || user.roles === RoleEnum.SELLER),
    login,
    logout,
    register,
    googleLogin: handleGoogleLogin,
    facebookLogin: handleFacebookLogin,
    setUser: handleSetUserData,
    loginLoading,
    logoutLoading,
    registerLoading,
    socialLoading,
  };
};
