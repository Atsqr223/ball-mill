import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function Inbox(props) {

    // page title
    document.title = "Subha welcomes you | " + props.title;

    const navigate = useNavigate();

    const readMail = (index) => {
        console.log("HELLO READ MAIL");
    }

    useEffect(() => {
    }, []);

    return (
        <>
            {/* <!-- Content Header (Page header) --> */}
            <div className="content-header">
                <div className="container">
                    {/* <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0"> Top Navigation <small>Example 3.0</small></h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Layout</a></li>
                                <li className="breadcrumb-item active">Top Navigation</li>
                            </ol>
                        </div>
                    </div> */}
                </div>
            </div>
            {/* <!-- /.content-header --> */}

            {/* <!-- Main content --> */}
            <div className="content" style={{ marginTop: "40px", marginBottom: '52px' }}>
                <section className="container">
                    <div className="row">
                        <div className="col-md-3 d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block overflow-auto" style={{ height: '100vh' }}>
                            <Link to="/mail/compose" className="btn btn-primary btn-block mb-3">Compose</Link>

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Folders</h3>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="nav nav-pills flex-column">
                                        <li className="nav-item active">
                                            <Link to="/mail/inbox" className="nav-link">
                                                <i className="fas fa-inbox"></i> Inbox
                                                <span className="badge bg-primary float-right">12</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/mail/sent" className="nav-link">
                                                <i className="far fa-envelope"></i> Sent
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/mail/drafts" className="nav-link">
                                                <i className="far fa-file-alt"></i> Drafts
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/mail/junk" className="nav-link">
                                                <i className="fas fa-filter"></i> Junk
                                                <span className="badge bg-warning float-right">65</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/mail/trash" className="nav-link">
                                                <i className="far fa-trash-alt"></i> Trash
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Labels</h3>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="nav nav-pills flex-column">
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                <i className="far fa-circle text-danger"></i>
                                                Important
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                <i className="far fa-circle text-warning"></i> Promotions
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                <i className="far fa-circle text-primary"></i>
                                                Social
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 overflow-auto" style={{ height: '100vh' }}>
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">{props.title}</h3>

                                    <div className="card-tools">
                                        <div className="input-group input-group-sm">
                                            <input type="text" className="form-control" placeholder="Search Mail" />
                                            <div className="input-group-append">
                                                <div className="btn btn-primary">
                                                    <i className="fas fa-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0">
                                    <div className="mailbox-controls">
                                        <button type="button" className="btn btn-default btn-sm checkbox-toggle"><i className="far fa-square"></i>
                                        </button>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-default btn-sm">
                                                <i className="far fa-trash-alt"></i>
                                            </button>
                                            <button type="button" className="btn btn-default btn-sm">
                                                <i className="fas fa-reply"></i>
                                            </button>
                                            <button type="button" className="btn btn-default btn-sm">
                                                <i className="fas fa-share"></i>
                                            </button>
                                        </div>

                                        <button type="button" className="btn btn-default btn-sm">
                                            <i className="fas fa-sync-alt"></i>
                                        </button>
                                        <div className="float-right">
                                            1-50/200
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default btn-sm">
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>
                                                <button type="button" className="btn btn-default btn-sm">
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive mailbox-messages">
                                        <table className="table table-hover table-striped">
                                            <tbody>
                                                <tr onClick={() => {readMail(1)}}>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check1" />
                                                            <label htmlFor="check1"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"></td>
                                                    <td className="mailbox-date">5 mins ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check2" />
                                                            <label htmlFor="check2"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">28 mins ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check3" />
                                                            <label htmlFor="check3"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">11 hours ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check4" />
                                                            <label htmlFor="check4"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"></td>
                                                    <td className="mailbox-date">15 hours ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check5" />
                                                            <label htmlFor="check5"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">Yesterday</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check6" />
                                                            <label htmlFor="check6"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">2 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check7" />
                                                            <label htmlFor="check7"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">2 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check8" />
                                                            <label htmlFor="check8"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"></td>
                                                    <td className="mailbox-date">2 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check9" />
                                                            <label htmlFor="check9"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"></td>
                                                    <td className="mailbox-date">2 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check10" />
                                                            <label htmlFor="check10"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"></td>
                                                    <td className="mailbox-date">2 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check11" />
                                                            <label htmlFor="check11"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">4 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check12" />
                                                            <label htmlFor="check12"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"></td>
                                                    <td className="mailbox-date">12 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check13" />
                                                            <label htmlFor="check13"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star-o text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">12 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check14" />
                                                            <label htmlFor="check14"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">14 days ago</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="icheck-primary">
                                                            <input type="checkbox" value="" id="check15" />
                                                            <label htmlFor="check15"></label>
                                                        </div>
                                                    </td>
                                                    <td className="mailbox-star"><a href="#"><i className="fas fa-star text-warning"></i></a></td>
                                                    <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                                                    <td className="mailbox-subject"><b>AdminLTE 3.0 Issue</b> - Trying to find a solution to this problem...
                                                    </td>
                                                    <td className="mailbox-attachment"><i className="fas fa-paperclip"></i></td>
                                                    <td className="mailbox-date">15 days ago</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card-footer p-0">
                                    <div className="mailbox-controls">
                                        <button type="button" className="btn btn-default btn-sm checkbox-toggle">
                                            <i className="far fa-square"></i>
                                        </button>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-default btn-sm">
                                                <i className="far fa-trash-alt"></i>
                                            </button>
                                            <button type="button" className="btn btn-default btn-sm">
                                                <i className="fas fa-reply"></i>
                                            </button>
                                            <button type="button" className="btn btn-default btn-sm">
                                                <i className="fas fa-share"></i>
                                            </button>
                                        </div>

                                        <button type="button" className="btn btn-default btn-sm">
                                            <i className="fas fa-sync-alt"></i>
                                        </button>
                                        <div className="float-right">
                                            1-50/200
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default btn-sm">
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>
                                                <button type="button" className="btn btn-default btn-sm">
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}