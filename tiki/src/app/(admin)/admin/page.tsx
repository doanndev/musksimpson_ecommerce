"use client";

import { useCurrentUserQuery } from "@/api/user/query";
import { RoleEnum } from "@/lib/constants/role";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import DashboardChart from "./components/DashboardChart";

const userGrowthData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 300 },
  { name: "Mar", users: 200 },
  { name: "Apr", users: 278 },
  { name: "May", users: 189 },
];

const orderTrendsData = [
  { name: "Jan", orders: 240 },
  { name: "Feb", orders: 139 },
  { name: "Mar", orders: 980 },
  { name: "Apr", orders: 390 },
  { name: "May", orders: 480 },
];

// 👉 Data giả cho Seller
const sellerOrderData = [
  { name: "Jan", sales: 1200 },
  { name: "Feb", sales: 800 },
  { name: "Mar", sales: 1500 },
  { name: "Apr", sales: 1100 },
  { name: "May", sales: 1700 },
];

const sellerProductViewsData = [
  { name: "Jan", views: 5000 },
  { name: "Feb", views: 4500 },
  { name: "Mar", views: 7000 },
  { name: "Apr", views: 6000 },
  { name: "May", views: 8000 },
];

const DashBoardPage = () => {
  const { data: currentUser, isLoading } = useCurrentUserQuery();
  useEffect(() => {
    if (currentUser) {
      console.log("Current User:", currentUser);
    }
  }, [currentUser]);

  if (isLoading) return <div>Loading...</div>;
  if (!currentUser) return <div>Error: User not found</div>;

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6">
        Dashboard
      </Typography>

      {currentUser.roles === RoleEnum.ADMIN ? (
        <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DashboardChart
            type="line"
            title="User Growth"
            data={userGrowthData}
            dataKey="users"
          />
          <DashboardChart
            type="bar"
            title="Order Trends"
            data={orderTrendsData}
            dataKey="orders"
          />
        </Box>
      ) : currentUser.roles === RoleEnum.SELLER ? (
        <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DashboardChart
            type="bar"
            title="Doanh số theo tháng"
            data={sellerOrderData}
            dataKey="sales"
          />
          <DashboardChart
            type="line"
            title="Lượt xem sản phẩm"
            data={sellerProductViewsData}
            dataKey="views"
          />
        </Box>
      ) : (
        <Typography>Dashboard không khả dụng cho vai trò này</Typography>
      )}
    </Box>
  );
};

export default DashBoardPage;
