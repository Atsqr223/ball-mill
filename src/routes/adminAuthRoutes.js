import React, { lazy } from "react";
import { Redirect, Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { authCheck } from "../utils/authHelper";

// admin layouts
const AdminLayouts = lazy(() => import('../layouts/admin/adminLayouts'));

// admin pages
const Dashboard = lazy(() => import('../pages/admin/dashboard'));

// error pages
const NotFound = lazy(() => import('../pages/error/notFound'));


const routes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
  },
  {
    path: "*",
    component: <NotFound />,
  },
];

export const AdminAuthRoutes = () => {
  return <Route path="/admin" element={
    authCheck('admin') === true ? (
      <AdminLayouts />
    ) : (
      <Navigate replace to="/admin/auth/login" />
    )
  }>
    <Route index element={routes[0].component} />
    {routes.map((route, index) => (
      <Route path={route.path} element={route.component} />
    ))}
    <Route path="*" element={<NotFound />} />
  </Route>
};
