import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";

import RightPanelAds from '../../../components/ads/RightPanelAds';
import AlertBox from "../../../components/common/AlertBox";
import { utcToLocalTime } from "../../../utils/timeHelper";
import ViewFullPostComponent from '../../../components/post/ViewFullPostComponent';
import ProfileLeftPanel from '../../../components/profile/ProfileLeftPanel';
import FollowUnfollowButton from '../../../components/profile/FollowUnfollowButton';

// component
export default function ViewSinglePost(props) {
    const { authFlag, authToken, authUser } = useOutletContext();
    const { slug } = useParams();

    // page title
    document.title = "Subha welcomes you | View Post";
    const navigate = useNavigate();
    const [post, setPost] = useState([]);
    const [postsLoader, setPostsLoader] = useState(true);
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const updatePostArray = (updatedPost) => {
        // Re-render with the new array
        setPost(updatedPost);
    };

    const deleteFromPostArray = (deletedPost) => {
    };

    // fetch data
    const fetchData = async () => {
        setPostsLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/get-single-post?slug=${slug}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((postsRes) => {
                setPostsLoader(false);
                if (postsRes.success === true) {
                    setPost(postsRes.data.post);
                } else {
                    setPost({});
                }
            });
        } catch (error) {
            setPostsLoader(false);
            setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
            setAlertBox((prevFormData) => ({ ...prevFormData, message: 'An error occord.' }));
        } finally {
            setPostsLoader(false);
        }
    };

    useEffect(() => {
        if (post.length === 0) {
            fetchData();
        }
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
            <div className="content" style={{ marginTop: "40px" }}>
                <div className="container">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Post by - {post?.auther?.name ? <>
                                        {post?.auther?.name}
                                    </> : <>
                                        <div className="spinner-border spinner-border-base" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </>}</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><Link to={'/feeds'}>Feed's</Link></li>
                                        <li className="breadcrumb-item active">View Post</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>


                    <section className="content">
                        <div className="container-fluid">
                            <div className='row'>
                                <div className='col-md-3 overflow-auto' style={{ height: '100vh' }}>
                                    <ProfileLeftPanel />
                                </div>

                                <div id="scrollableDiv" className="col-md-6 overflow-auto" style={{ height: '100vh' }}>
                                    <AlertBox alert={alertBox.alert} message={alertBox.message} />

                                    {postsLoader ? <div className='text-center mb-2'>
                                        <div className="spinner-grow text-primary"></div>
                                        <div className="spinner-grow text-success ml-2"></div>
                                        <div className="spinner-grow text-info ml-2"></div>
                                        <div className="spinner-grow text-warning ml-2"></div>
                                        <div className="spinner-grow text-danger ml-2"></div>
                                    </div> : <>
                                        <ViewFullPostComponent
                                            postIndex={0}
                                            post={post}
                                            updatePostArray={updatePostArray}
                                            deleteFromPostArray={deleteFromPostArray}
                                            authFlag={authFlag}
                                            authToken={authToken}
                                            authUser={authUser} />
                                    </>}
                                </div>

                                <div className='col-md-3 overflow-auto' style={{ height: '100vh' }}>
                                    <RightPanelAds />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}