import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

// component
export default function Header(props) {

    const navigate = useNavigate();

    const logout = () => {
        Swal.fire({
            title: "Do you want to logout ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                localStorage.removeItem(process.env.REACT_APP_USER_AUTH_KEY);
                localStorage.clear();
                setTimeout(() => {
                    console.log("REDIRECT");
                    window.location.reload();
                    // navigate("/auth/login", { replace: true });
                }, 1000);
            } else {
                console.log('Logout cancel.');
            }
        });
    }

    return (
        // <nav className="main-header navbar navbar-expand-md navbar-light navbar-white">
        <nav className='main-header navbar navbar-expand-md navbar-dark fixed-top bg-dark'>
            <div className="container">
                <a href="/" className="navbar-brand">
                    <img src="/assets/dist/img/subhaLogo.png" alt="SubhaPrasad Logo" className="brand-image img-circle elevation-3"
                        style={{ opacity: .8 }} />
                    <span className="brand-text font-weight-light">&nbsp;{process.env.REACT_APP_TITLE}</span>
                </a>

                {
                    props.basicData.authFlag ? (<div className="collapse navbar-collapse order-3" id="navbarCollapse">
                        {/* <!-- Left navbar links --> */}
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/feeds" className="nav-link">Feeds</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/messages" className="nav-link">Chats</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">
                                    <i className="fas fa-user"></i>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" role="button" onClick={logout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                </a>
                            </li>
                        </ul>
                    </div>) : (<div className="collapse navbar-collapse order-3" id="navbarCollapse">
                        {/* <!-- Left navbar links --> */}
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to="/auth/login" className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/auth/signup" className="nav-link">Sign up</Link>
                            </li>
                        </ul>
                    </div>)
                }

                <button className="navbar-toggler order-1" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>
    );
}
