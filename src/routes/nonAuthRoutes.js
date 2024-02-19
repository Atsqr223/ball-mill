import React, { lazy } from "react";
import { Redirect, Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { authCheck } from "../utils/authHelper";

// components
// pages admin auth
const AdminLoginLayouts = lazy(() => import('../layouts/admin/adminAuth/adminLoginLayouts'));
const AdminLogin = lazy(() => import('../pages/admin/adminLogin'));

// pages user auth
const UserLoginLayouts = lazy(() => import('../layouts/user/userAuth/userLoginLayouts'));
const UserLogin = lazy(() => import('../pages/user/userLogin'));
const UserSignup = lazy(() => import('../pages/user/userSignup'));

// error pages
const NotFound = lazy(() => import('../pages/error/notFound'));

const adminNonAuthRoutes = [
  {
    path: "login",
    component: <AdminLogin />,
  },
  {
    path: "forgot-password",
    component: <AdminLogin />,
  },
  {
    path: "reset-password",
    component: <AdminLogin />,
  },
];

const userNonAuthRoutes = [
  {
    path: "login",
    component: <UserLogin />,
  },
  {
    path: "signup",
    component: <UserSignup />,
  },
  {
    path: "forgot-password",
    component: <UserSignup />,
  },
  {
    path: "reset-password",
    component: <UserSignup />,
  },
];

export const NonAuthRoutes = () => {
  return <>
    <Route path="/auth" element={
      authCheck() === false ? (
        <UserLoginLayouts />
      ) : (
        <Navigate replace to="/feeds" />
      )
    }>
      <Route index element={<UserLogin />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="signup" element={<UserSignup />} />
      <Route path="forgot-password" element={<UserSignup />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    {/* admin routes */}
    <Route path="/admin/auth" element={
      authCheck() === false ? (
        <AdminLoginLayouts />
      ) : (
        <Navigate replace to="/admin/dashboard" />
      )
    }>
      <Route index element={<UserLogin />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="signup" element={<UserSignup />} />
      <Route path="forgot-password" element={<UserSignup />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
};
