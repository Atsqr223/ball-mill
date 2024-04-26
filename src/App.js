import './App.css';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

// auth helper
import { authCheck } from "./utils/authHelper";

// pages admin auth
const AdminLoginLayouts = lazy(() => import('./layouts/admin/adminLogin/adminLoginLayouts'));
const AdminLogin = lazy(() => import('./pages/admin/adminLogin'));

// pages user auth
const UserLoginLayouts = lazy(() => import('./layouts/user/userLogin/userLoginLayouts'));
const UserLogin = lazy(() => import('./pages/user/auth/userLogin'));
const UserSignup = lazy(() => import('./pages/user/auth/userSignup'));
const UserForgotPassword = lazy(() => import('./pages/user/auth/userForgotPassword'));

// pages admin
const AdminLayouts = lazy(() => import('./layouts/admin/adminLayouts'));
const Dashboard = lazy(() => import('./pages/admin/dashboard'));

// pages user
const UserLayouts = lazy(() => import('./layouts/user/userLayouts'));
const Home = lazy(() => import('./pages/user/home'));
const Feeds = lazy(() => import('./pages/user/feeds/feeds'));
const ViewSinglePost = lazy(() => import('./pages/user/post/ViewSinglePost'));
const Profile = lazy(() => import('./pages/user/profile/profile'));
const FollowersFollowingList = lazy(() => import('./pages/user/profile/FollowersFollowingList'));
const ViewProfile = lazy(() => import('./pages/user/profile/ViewProfile'));
const Inbox = lazy(() => import('./pages/user/mailbox/inbox'));
const ComposeMail = lazy(() => import('./pages/user/mailbox/compose'));
const ReadMail = lazy(() => import('./pages/user/mailbox/read'));
const Notification = lazy(() => import('./pages/user/notification'));
const Messages = lazy(() => import('./pages/user/chats/messages'));


// error pages
const NotFound = lazy(() => import('./pages/error/notFound'));


function App() {

  const loginFlag = authCheck();

  console.log("userLoginFlag:: ", loginFlag);

  useEffect(() => {
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="preloader flex-column justify-content-center align-items-center">
        <img className="animation__wobble" src="/assets/dist/img/subhaLogo.png" alt="SubhaPrasad" height="60" width="60" />
      </div>}>
        <Routes>
          {/* common routes */}
          <Route element={<UserLayouts authData={loginFlag} />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
          </Route>

          {/* user routes start */}
          <Route path="/auth" element={
            loginFlag ? (
              <Navigate replace to="/feeds" />
            ) : (
              <UserLoginLayouts />
            )
          }>
            <Route index element={<UserLogin />} />
            <Route path="login" element={<UserLogin />} />
            <Route path="signup" element={<UserSignup />} />
            <Route path="forgot-password" element={<UserForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={
            loginFlag ? (
              <UserLayouts authData={loginFlag} />
            ) : (
              <Navigate replace to="/auth/login" />
            )
          }>
            <Route path="feeds" element={<Feeds />} />
            <Route path="profile/:username" element={<ViewProfile />} />
            <Route path="profile/followers" element={<FollowersFollowingList title="Followers" />} />
            <Route path="profile/following" element={<FollowersFollowingList title="Following" />} />
            <Route path="view-post/:slug" element={<ViewSinglePost />} />

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
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* user routes end */}


          {/* admin routes start */}
          <Route path="/admin/auth" element={
            loginFlag ? (
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
            loginFlag ? (
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
