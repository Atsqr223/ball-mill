import React, { lazy } from "react";
import { Redirect, Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { authCheck } from "../utils/authHelper";

// pages user
const UserLayouts = lazy(() => import('../layouts/user/userLayouts'));
const Home = lazy(() => import('../pages/user/home'));
const Inbox = lazy(() => import('../pages/user/mailbox/inbox'));
const ComposeMail = lazy(() => import('../pages/user/mailbox/compose'));
const ReadMail = lazy(() => import('../pages/user/mailbox/read'));
const Notification = lazy(() => import('../pages/user/notification'));
const Messages = lazy(() => import('../pages/user/messages'));

// error pages
const NotFound = lazy(() => import('../pages/error/notFound'));


const routes = [];

export const UserAuthRoutes = () => {
  return <Route element={
    authCheck() === true ? (
      <UserLayouts />
    ) : (
      <Navigate replace to="/auth/login" />
    )
  }>
    <Route index element={<Home />} />
    <Route path="home" element={<Home />} />
    
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
};
