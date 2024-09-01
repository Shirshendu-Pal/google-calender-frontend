import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import MainRoutes from "./MainRoutes";

export const PrivateRoutes = ({ user }) => {
  console.log("PrivateRoutes")
  return user ? <Outlet /> : <Navigate to={MainRoutes.LOGIN} />;
};
