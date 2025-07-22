"use client";

import MainContent from "@/components/ui/admin/MainContent";
import ChatBot from "@/components/ui/client/ChatBot";
import { useUserLogin } from "@/hooks/useUserLogin";
import { RoleEnum } from "@/lib/constants/role";
import { ROUTES } from "@/lib/routes";
import { Box, useMediaQuery } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { AccountSidebar, AdminSidebar } from "../Sidebar";
import Breadcrumb from "../Sidebar/AccountSidebar/Breadcrumb";

interface Props extends React.PropsWithChildren {}

const ClientLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const isShowHeaderFooter = !(
    [
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
      ROUTES.PAYMENT,
    ] as string[]
  ).some((route) => pathname.startsWith(route));

  if (isMobile)
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Hiện tại không hỗ trợ trang web trên điện thoại</p>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col">
      {isShowHeaderFooter && <Header />}
      <main className="">
        {children}
        <ChatBot />
      </main>
      {isShowHeaderFooter && <Footer />}
    </div>
  );
};

const ADMIN_ROUTES = [
  ROUTES.ADMIN_HOME,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_PRODUCTS,
  ROUTES.ADMIN_PRODUCTS_CREATE,
];
const PUBLIC_ADMIN_ROUTES = [
  ROUTES.ADMIN_LOGIN,
  ROUTES.ADMIN_FORGOT_PASSWORD,
  ROUTES.ADMIN_RESET_PASSWORD,
];

const AdminLayout: React.FC<Props> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [isOpen, setIsOpen] = useState(true);
  const { isLoggedIn, user, isLoading } = useUserLogin();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (isLoading) return;

    const checkAccess = async () => {
      if (isPublicRoute) return;

      if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
        if (!isLoggedIn || !user) {
          router.push(ROUTES.ADMIN_LOGIN);
          toast.error("Please log in to access the admin panel.");
          return;
        }

        const roleId = user.roles;
        if (roleId !== RoleEnum.ADMIN && roleId !== RoleEnum.SELLER) {
          router.push(ROUTES.HOME);
          toast.error(
            "Access denied: Only Admin and Seller can access the admin panel."
          );
          return;
        }
      }
    };

    checkAccess();
  }, [isLoggedIn, user, pathname, router, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  if (isMobile)
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Hiện tại không hỗ trợ trang web trên điện thoại</p>
      </div>
    );

  return isPublicRoute ? (
    <div className="flex min-h-screen flex-col">
      <main>{children}</main>
    </div>
  ) : (
    <Box className="flex min-h-screen">
      <AdminSidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <MainContent isSidebarOpen={isOpen}>{children}</MainContent>
    </Box>
  );
};

const AccountLayout: React.FC<Props> = ({ children }) => {
  return (
    <Box className="container flex min-h-screen flex-col bg-gray-100">
      <Box className="py-6">
        <Breadcrumb />
      </Box>
      <Box className="flex flex-1">
        <AccountSidebar />
        <Box className="flex-1 overflow-auto pl-6">
          <main>{children}</main>
        </Box>
      </Box>
    </Box>
  );
};

export { AccountLayout, AdminLayout, ClientLayout };
