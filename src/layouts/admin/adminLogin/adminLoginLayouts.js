import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

// component

export default function AdminLoginLayouts(props) {

    // remove class from body tag
    document.body.classList.remove('hold-transition');
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('sidebar-mini');
    document.body.classList.remove('layout-fixed');
    document.body.classList.remove('layout-navbar-fixed');
    document.body.classList.remove('layout-footer-fixed');
    document.body.classList.remove('hold-transition');
    document.body.classList.remove('layout-top-nav');
    document.getElementById("root").classList.remove("wrapper");

    // add class in body tag
    document.body.classList.add('hold-transition');
    document.body.classList.add('login-page');
    document.getElementById("root").classList.add("login-box");
    document.body.style.minHeight = '463.333px';
    document.body.style.height = null;

    let basicData = {
        today: new Date(),
        navigate: useNavigate()
    }

    return (
        <div className="login-box">
            <div className="card card-outline card-primary">
                <div className="card-header text-center">
                    <a href={process.env.REACT_APP_ADMIN_BASE_URL} className="h1"><b>{process.env.REACT_APP_TITLE}</b></a>
                </div>
                <div className="card-body">
                    <Outlet context={basicData} />
                </div>
            </div>
        </div>
    );
}
