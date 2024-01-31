import './App.css';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

// pages admin auth
const AdminLoginLayouts = lazy(() => import('./layouts/admin/adminAuth/adminLoginLayouts'));
const AdminLogin = lazy(() => import('./pages/admin/adminLogin'));

// pages user auth
const UserLoginLayouts = lazy(() => import('./layouts/user/userAuth/userLoginLayouts'));
const UserLogin = lazy(() => import('./pages/user/userLogin'));
const UserSignup = lazy(() => import('./pages/user/userSignup'));

// pages admin
const AdminLayouts = lazy(() => import('./layouts/admin/adminLayouts'));
const Dashboard = lazy(() => import('./pages/admin/dashboard'));

// pages user
const UserLayouts = lazy(() => import('./layouts/user/userLayouts'));
const Home = lazy(() => import('./pages/user/home'));
const Feeds = lazy(() => import('./pages/user/feeds'));
const Inbox = lazy(() => import('./pages/user/mailbox/inbox'));
const ComposeMail = lazy(() => import('./pages/user/mailbox/compose'));
const ReadMail = lazy(() => import('./pages/user/mailbox/read'));
const Notification = lazy(() => import('./pages/user/notification'));
const Messages = lazy(() => import('./pages/user/messages'));

// error pages
const NotFound = lazy(() => import('./pages/error/notFound'));


function App() {

  const userLoginFlag = JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY));
  const adminLoginFlag = JSON.parse(localStorage.getItem(process.env.REACT_APP_ADMIN_AUTH_KEY));

  console.log("userLoginFlag:: ", userLoginFlag);

  useEffect(() => {
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="preloader flex-column justify-content-center align-items-center">
        <img className="animation__wobble" src="/assets/dist/img/AdminLTELogo.png" alt="AdminLTELogo" height="60" width="60" />
      </div>}>
        <Routes>
          {/* user routes start */}
          <Route path="/auth" element={
            userLoginFlag ? (
              <Navigate replace to="/feeds" />
            ) : (
              <UserLoginLayouts />
            )
          }>
            <Route index element={<UserLogin />} />
            <Route path="login" element={<UserLogin />} />
            <Route path="signup" element={<UserSignup />} />
            <Route path="forgot-password" element={<UserSignup />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={
            userLoginFlag ? (
              <UserLayouts authData={userLoginFlag} />
            ) : (
              <Navigate replace to="/auth/login" />
            )
          }>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="feeds" element={<Feeds />} />
            
            <Route path="/mail">
              <Route index path="inbox" element={<Inbox title="Inbox" />} />
              <Route path="compose" element={<ComposeMail />} />
              <Route path="read" element={<ReadMail />} />
              <Route path="sent" element={<Inbox title="Sent" />} />
              <Route path="drafts" element={<Inbox title="Drafts" />} />
              <Route path="junk" element={<Inbox title="Junk" />} />
              <Route path="trash" element={<Inbox title="Trash" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            <Route path="messages" element={<Messages title="Chats" />} />
            <Route path="notification" element={<Notification />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* user routes end */}


          {/* admin routes start */}
          <Route path="/admin/auth" element={
            adminLoginFlag ? (
              <Navigate replace to="/admin/dashboard" />
            ) : (
              <AdminLoginLayouts />
            )
          }>
            <Route index element={<AdminLogin />} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={
            adminLoginFlag ? (
              <AdminLayouts />
            ) : (
              <Navigate replace to="/admin/auth/login" />
            )
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* admin routes end */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
