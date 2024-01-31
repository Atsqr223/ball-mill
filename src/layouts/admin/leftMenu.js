import React, { useState, useEffect } from 'react';

// component
export default function LeftMenu(props) {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* <!-- Brand Logo --> */}
            <a href="index3.html" className="brand-link">
                <img src='/assets/dist/img/AdminLTELogo.png' alt="AdminLTE Logo" className="brand-image img-circle elevation-3"
                    style={{ opacity: .8 }} />
                <span className="brand-text font-weight-light">&nbsp;{process.env.REACT_APP_TITLE}</span>
            </a>

            {/* <!-- Sidebar --> */}
            <div className="sidebar">
                {/* <!-- Sidebar user panel (optional) --> */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src='/assets/dist/img/user2-160x160.jpg' className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">Alexander Pierce</a>
                    </div>
                </div>

                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        {/* <!-- Add icons to the links using the .nav-icon class */}
                        {/* with font-awesome or any other icon font library --> */}
                        <li className="nav-item active">
                            <a href="/admin/dashboard" className="nav-link active">
                                <i className="nav-icon fas fa-tachometer-alt"></i>
                                <p>
                                    Dashboard
                                    <span className="right badge badge-danger">New</span>
                                </p>
                            </a>
                        </li>

                        {/* Management */}
                        <li className="nav-header">Management</li>
                        <li className="nav-item">
                            <a href="iframe.html" className="nav-link">
                                <i className="nav-icon fa fa-list-alt"></i>
                                <p>Category</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="iframe.html" className="nav-link">
                                <i className="nav-icon fa fa-user"></i>
                                <p>User</p>
                            </a>
                        </li>

                        {/* Setting */}
                        <li className="nav-header">Setting</li>
                        <li className="nav-item">
                            <a href="iframe.html" className="nav-link">
                                <i className="nav-icon fa fa-gear fa-spin"></i>
                                <p>Application</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="iframe.html" className="nav-link">
                                <i className="nav-icon fa fa-key"></i>
                                <p>Auth</p>
                            </a>
                        </li>
                    </ul>
                </nav>
                {/* <!-- /.sidebar-menu --> */}
            </div>
            {/* <!-- /.sidebar --> */}
        </aside>
    );
}
