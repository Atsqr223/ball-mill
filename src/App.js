import './App.css';
import React, {useState, useEffect, lazy, Suspense } from 'react'; 
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { authCheck } from "./utils/authHelper";
import axios from 'axios';


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

//pages user feeds
const Feeds = lazy(() => import('./pages/user/feeds/feeds'));

const TCSRIButton = lazy(() => import('./pages/user/feeds/TCSRI/TCSRIButton'));
const SignalAnalysis1 = lazy(() => import('./pages/user/feeds/TCSRI/SignalAnalysis1'));
const Radar1 = lazy(() => import('./pages/user/feeds/TCSRI/Radar1'));
const RadarDatasetTCSRI1 = lazy(() => import('./pages/user/feeds/TCSRI/Radar11/RadarDatasetTCSRI1'));
const RadarDatasetTCSRI2 = lazy(() => import('./pages/user/feeds/TCSRI/Radar11/RadarDatasetTCSRI2'));
const Mic1 = lazy(() => import('./pages/user/feeds/TCSRI/Mic1'));
const MicDatasetTCSRI1 = lazy(() => import('./pages/user/feeds/TCSRI/Mic11/MicDatasetTCSRI1'));
const Accelerator1 = lazy(() => import('./pages/user/feeds/TCSRI/Accelerator1'));
const AcceleratorDatasetTCSRI1 = lazy(() => import('./pages/user/feeds/TCSRI/Accelerator11/AcceleratorDatasetTCSRI1'));
const SignalAcquisition1 = lazy(() => import('./pages/user/feeds/TCSRI/SignalAcquisition1'));

const IITKGPButton = lazy(() => import('./pages/user/feeds/IITKGP/IITKGPButton'));
const SignalAnalysis2 = lazy(() => import('./pages/user/feeds/IITKGP/SignalAnalysis2'));
const Radar2 = lazy(() => import('./pages/user/feeds/IITKGP/Radar2'));
const RadarDatasetIITKGP1 = lazy(() => import('./pages/user/feeds/IITKGP/Radar21/RadarDatasetIITKGP1'));
const Mic2 = lazy(() => import('./pages/user/feeds/IITKGP/Mic2'));
const MicDatasetIITKGP1 = lazy(() => import('./pages/user/feeds/IITKGP/Mic21/MicDatasetIITKGP1'));
const Accelerator2 = lazy(() => import('./pages/user/feeds/IITKGP/Accelerator2'));
const AcceleratorDatasetIITKGP1 = lazy(() => import('./pages/user/feeds/IITKGP/Accelerator21/AcceleratorDatasetIITKGP1'));
const SignalAcquisition2 = lazy(() => import('./pages/user/feeds/IITKGP/SignalAcquisition2'));

const TCSButton = lazy(() => import('./pages/user/feeds/TCS/TCSButton'));
const SignalAnalysis3 = lazy(() => import('./pages/user/feeds/TCS/SignalAnalysis3'));
const Radar3 = lazy(() => import('./pages/user/feeds/TCS/Radar3'));
const RadarDatasetTCS1 = lazy(() => import('./pages/user/feeds/TCS/Radar31/RadarDatasetTCS1'));
const Mic3 = lazy(() => import('./pages/user/feeds/TCS/Mic3'));
const MicDatasetTCS1 = lazy(() => import('./pages/user/feeds/TCS/Mic31/MicDatasetTCS1'));
const Accelerator3 = lazy(() => import('./pages/user/feeds/TCS/Accelerator3'));
const AcceleratorDatasetTCS1 = lazy(() => import('./pages/user/feeds/TCS/Accelerator31/AcceleratorDatasetTCS1'));
const SignalAcquisition3 = lazy(() => import('./pages/user/feeds/TCS/SignalAcquisition3'));

const ViewSinglePost = lazy(() => import('./pages/user/post/ViewSinglePost'));
const Profile = lazy(() => import('./pages/user/profile/profile'));
const FollowersFollowingList = lazy(() => import('./pages/user/profile/FollowersFollowingList'));
const ViewProfile = lazy(() => import('./pages/user/profile/ViewProfile'));
const Inbox = lazy(() => import('./pages/user/mailbox/inbox'));
const ComposeMail = lazy(() => import('./pages/user/mailbox/compose'));
const ReadMail = lazy(() => import('./pages/user/mailbox/read'));
const Notification = lazy(() => import('./pages/user/notification'));
const Messages = lazy(() => import('./pages/user/chats/messages'));

const NotFound = lazy(() => import('./pages/error/notFound'));

function App() {
  const loginFlag = authCheck();

  console.log("userLoginFlag:: ", loginFlag);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000');
            
            // Check if response status is okay
            if (response.status === 200) {
                setData(response.data); // Assuming response.data is correctly structured for your use case
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="preloader flex-column justify-content-center align-items-center">
        <img className="animation__bounce" src="assets/dist/img/TCSRI.jpg" alt="TCS" height="60" width="60" />
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

            <Route path="TCSRIButton.js" element={<TCSRIButton />} />
            <Route path="SignalAnalysis1.js" element={<SignalAnalysis1 />} />
            <Route path="Radar1.js" element={<Radar1 />} /> 
            <Route path="RadarDatasetTCSRI1.js" element={<RadarDatasetTCSRI1 />} /> 
            <Route path="RadarDatasetTCSRI2.js" element={<RadarDatasetTCSRI2 />} />
            <Route path="Mic1.js" element={<Mic1 />} />
            <Route path="MicDatasetTCSRI1.js" element={<MicDatasetTCSRI1 />} />
            <Route path="Accelerator1.js" element={<Accelerator1 />} />
            <Route path="AcceleratorDatasetTCSRI1.js" element={<AcceleratorDatasetTCSRI1 />} />
            <Route path="SignalAcquisition1.js" element={<SignalAcquisition1 />} />

            <Route path="IITKGPButton.js" element={<IITKGPButton />} />
            <Route path="SignalAnalysis2.js" element={<SignalAnalysis2 />} />
            <Route path="Radar2.js" element={<Radar2 />} />
            <Route path="RadarDatasetIITKGP1.js" element={<RadarDatasetIITKGP1 />} />
            <Route path="Mic2.js" element={<Mic2 />} />
            <Route path="MicDatasetIITKGP1.js" element={<MicDatasetIITKGP1 />} />
            <Route path="Accelerator2.js" element={<Accelerator2 />} />
            <Route path="AcceleratorDatasetIITKGP1.js" element={<AcceleratorDatasetIITKGP1 />} />
            <Route path="SignalAcquisition2.js" element={<SignalAcquisition2 />} />
            
            <Route path="TCSButton.js" element={<TCSButton />} />
            <Route path="SignalAnalysis3.js" element={<SignalAnalysis3 />} />
            <Route path="Radar3.js" element={<Radar3 />} />
            <Route path="RadarDatasetTCS1.js" element={<RadarDatasetTCS1 />} />
            <Route path="Mic3.js" element={<Mic3 />} />
            <Route path="MicDatasetTCS1.js" element={<MicDatasetTCS1 />} />
            <Route path="Accelerator3.js" element={<Accelerator3 />} />
            <Route path="AcceleratorDatasetTCS1.js" element={<AcceleratorDatasetTCS1 />} />
            <Route path="SignalAcquisition3.js" element={<SignalAcquisition3 />} />
            
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
