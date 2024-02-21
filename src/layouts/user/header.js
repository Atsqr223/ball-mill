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
                    <img src="/assets/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3"
                        style={{ opacity: .8 }} />
                    <span className="brand-text font-weight-light">&nbsp;{process.env.REACT_APP_TITLE}</span>
                </a>

                {
                    props.basicData.authFlag ? (<div className="collapse navbar-collapse order-3" id="navbarCollapse">
                        {/* <!-- Left navbar links --> */}
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to="/feeds" className="nav-link">Feeds</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/messages" className="nav-link">Chats</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link" data-toggle="dropdown" href="#">
                                    <i className="far fa-comments"></i>
                                    <span className="badge badge-danger navbar-badge">3</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                    <a href="#" className="dropdown-item">
                                        {/* <!-- Message Start --> */}
                                        <div className="media">
                                            <img src="/assets/dist/img/user1-128x128.jpg" alt="User Avatar" className="img-size-50 mr-3 img-circle" />
                                            <div className="media-body">
                                                <h3 className="dropdown-item-title">
                                                    Brad Diesel
                                                    <span className="float-right text-sm text-danger"><i className="fas fa-star"></i></span>
                                                </h3>
                                                <p className="text-sm">Call me whenever you can...</p>
                                                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                            </div>
                                        </div>
                                        {/* <!-- Message End --> */}
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item">
                                        {/* <!-- Message Start --> */}
                                        <div className="media">
                                            <img src="/assets/dist/img/user8-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3" />
                                            <div className="media-body">
                                                <h3 className="dropdown-item-title">
                                                    John Pierce
                                                    <span className="float-right text-sm text-muted"><i className="fas fa-star"></i></span>
                                                </h3>
                                                <p className="text-sm">I got your message bro</p>
                                                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                            </div>
                                        </div>
                                        {/* <!-- Message End --> */}
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item">
                                        {/* <!-- Message Start --> */}
                                        <div className="media">
                                            <img src="/assets/dist/img/user3-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3" />
                                            <div className="media-body">
                                                <h3 className="dropdown-item-title">
                                                    Nora Silvester
                                                    <span className="float-right text-sm text-warning"><i className="fas fa-star"></i></span>
                                                </h3>
                                                <p className="text-sm">The subject goes here</p>
                                                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                            </div>
                                        </div>
                                        {/* <!-- Message End --> */}
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/mail/inbox" className="dropdown-item dropdown-footer">See All Messages</Link>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link" data-toggle="dropdown" href="#">
                                    <i className="far fa-bell"></i>
                                    <span className="badge badge-warning navbar-badge">15</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                    <span className="dropdown-item dropdown-header">15 Notifications</span>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item">
                                        <i className="fas fa-envelope mr-2"></i> 4 new messages
                                        <span className="float-right text-muted text-sm">3 mins</span>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item">
                                        <i className="fas fa-users mr-2"></i> 8 friend requests
                                        <span className="float-right text-muted text-sm">12 hours</span>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item">
                                        <i className="fas fa-file mr-2"></i> 3 new reports
                                        <span className="float-right text-muted text-sm">2 days</span>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/notification" className="dropdown-item dropdown-footer">See All Notifications</Link>
                                </div>
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
