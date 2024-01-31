import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

// components
import Header from './header';
import Footer from './footer';
import LeftMenu from './leftMenu';

// component
export default function UserLayouts(props) {

  // remove class from body tag
  document.body.classList.remove('hold-transition');
  document.body.classList.remove('layout-top-nav');
  document.body.classList.remove('hold-transition');
  document.body.classList.remove('login-page');
  document.getElementById("root").classList.remove("login-box");
  document.body.style.minHeight = null;
  document.body.style.height = 'auto';

  // add class in body
  document.body.classList.add('hold-transition');
  document.body.classList.add('dark-mode');
  document.body.classList.add('sidebar-mini');
  document.body.classList.add('layout-fixed');
  document.body.classList.add('layout-navbar-fixed');
  document.body.classList.add('layout-footer-fixed');
  document.getElementById("root").classList.add("wrapper");

  let basicData = {
    today: new Date(),
    navigate: useNavigate()
  }


  return (
    <>
      {/* <!-- Navbar --> */}
      <Header basicData={basicData} />
      {/* <!-- /.navbar --> */}

      {/* <!-- Main Sidebar Container --> */}
      <LeftMenu basicData={basicData} />

      {/* <!-- Content Wrapper. Contains page content --> */}
      <div className="content-wrapper">
        <Outlet context={basicData} />
      </div>
      {/* <!-- /.content-wrapper --> */}

      {/* <!-- Main Footer --> */}
      <Footer basicData={basicData} />
    </>
  );
}