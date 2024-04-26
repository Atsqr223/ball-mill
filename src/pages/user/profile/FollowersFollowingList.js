import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import ProfileLeftPanel from './ProfileLeftPanel';
import FollowUnfollowButton from './FollowUnfollowButton';

// component
export default function FollowersFollowingList(props) {
    // page title
    document.title = `Subha welcomes you | ${props.title}`;
    const { authFlag, authToken, authUser } = useOutletContext();
    let fetchApiCall = false;
    const navigate = useNavigate();
    const [pageLoader, setPageLoader] = useState(false);
    const [userList, setUserList] = useState([]);

    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });
    // user form update end

    // fetch data
    const fetchData = async () => {
        setPageLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/friends/get-${props.title.toLowerCase()}/${authUser._id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((followRes) => {
                if (followRes.success === true) {
                    setUserList(followRes.data[props.title.toLowerCase()]);
                }
            });
        } catch (error) {
            setPageLoader(false);
            setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
            setAlertBox((prevFormData) => ({ ...prevFormData, message: 'An error occord.' }));
        } finally {
            setPageLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
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
                <div className="container">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Profile</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><Link to="/feeds">Home</Link></li>
                                        <li className="breadcrumb-item active"><Link to="/profile">Profile</Link></li>
                                        <li className="breadcrumb-item active">{props.title}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-3">
                                    <ProfileLeftPanel />
                                </div>

                                <div className="col-md-9">
                                    <AlertBox alert={alertBox.alert} message={alertBox.message} />
                                    <div className="card card-primary">
                                        <div className="card-header">
                                            <h3 className="card-title">{props.title}</h3>
                                        </div>
                                        <div className="card-body">
                                            <div className="card card-solid">
                                                <div className="card-body pb-0">
                                                    <div className="row">
                                                        {pageLoader ? <>
                                                        </> : <>
                                                            {userList.map((user, i) => {
                                                                return <div key={i} className="col-12 col-sm-6 d-flex align-items-stretch flex-column">
                                                                    <div className="card bg-light d-flex flex-fill">
                                                                        <div className="card-body pt-2">
                                                                            <div className="row">
                                                                                <div className="col-7">
                                                                                    <Link to={`${process.env.REACT_APP_BASE_URL}profile/${user.username}`}>
                                                                                        <h2 className="lead"><b>{user.name}</b></h2>
                                                                                    </Link>
                                                                                    <p className="text-muted text-sm"><b>Location: </b> {user.location} </p>
                                                                                    <p className="text-muted text-sm"><b>Bio: </b> {user.bio.substring(0, 60) + "..."} </p>
                                                                                </div>
                                                                                <div className="col-5 text-center">
                                                                                    <img src={user.profile_picture_url} alt="user-avatar" className="img-circle img-fluid" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="card-footer">
                                                                            <div className="text-right">
                                                                                <FollowUnfollowButton isFollow={true} userData={user} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>;
                                                            })}
                                                        </>}
                                                    </div>
                                                </div>
                                                {/* <div className="card-footer">
                                                    <nav aria-label="Contacts Page Navigation">
                                                        <ul className="pagination justify-content-center m-0">
                                                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">4</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">5</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">6</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">7</a></li>
                                                            <li className="page-item"><a className="page-link" href="#">8</a></li>
                                                        </ul>
                                                    </nav>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}