import React, { useState, useEffect } from 'react';
import { Outlet, Link, redirect, useNavigate } from "react-router-dom";

// components
import Header from './header';
import Footer from './footer';

// auth helper
import { 
  authCheck,
  getAuthToken,
  getAuthUser
} from "../../utils/authHelper";

// component
export default function UserLayouts(props) {

  // remove class from body tag
  document.body.classList.remove('hold-transition');
  document.body.classList.remove('dark-mode');
  document.body.classList.remove('sidebar-mini');
  document.body.classList.remove('layout-fixed');
  document.body.classList.remove('layout-navbar-fixed');
  document.body.classList.remove('layout-footer-fixed');
  document.body.classList.remove('hold-transition');
  document.body.classList.remove('login-page');
  document.getElementById("root").classList.remove("login-box");
  document.body.style.minHeight = null;
  document.body.style.height = 'auto';

  // add class from body tag
  document.body.classList.add('hold-transition');
  document.body.classList.add('layout-top-nav');
  document.getElementById("root").classList.add("wrapper");

  let basicData = {
    today: new Date(),
    authFlag: authCheck(),
    authToken: getAuthToken(),
    authUser: getAuthUser()
  }

  return (
    <>
      {/* <!-- Navbar --> */}
      <Header basicData={basicData} />
      {/* <!-- /.navbar --> */}

      {/* <!-- Content Wrapper. Contains page content --> */}
      <div className="content-wrapper">
        <Outlet context={basicData} />
      </div>
      {/* <!-- /.content-wrapper --> */}

      {/* <!-- Control Sidebar --> */}
      <aside className="control-sidebar control-sidebar-dark">
        {/* <!-- Control sidebar content goes here --> */}
      </aside>

      <Footer basicData={basicData} />
    </>
  );
}