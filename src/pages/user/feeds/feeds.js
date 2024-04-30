import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";
import RightPanelAds from '../../../components/ads/RightPanelAds';

import AlertBox from "../../../components/common/AlertBox";
import ProfileLeftPanel from "../../../components/profile/ProfileLeftPanel";
import CreatePostComponent from "../../../components/post/CreatePostComponent";
import ViewPostComponent from '../../../components/post/ViewPostComponent';
import { utcToLocalTime } from "../../../utils/timeHelper";

// component
export default function Feeds(props) {
    const { authFlag, authToken, authUser } = useOutletContext();

    // page title
    document.title = "Subha welcomes you | Feed's";
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [postsLoader, setPostsLoader] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const newPostAdded = (newPost) => {
        setPosts(current => [newPost, ...current]);
    }

    const updatePostArray = (updatedPost) => {
        const nextShapes = posts.map(post => {
            if (post._id === updatedPost._id) {
                // No change
                return updatedPost;
            } else {
                // Return a new circle 50px below
                return post;
            }
        });
        // Re-render with the new array
        setPosts(nextShapes);
    };

    const deleteFromPostArray = (deletedPost) => {
        setPosts(oldValues => {
            return oldValues.filter(post => post !== deletedPost)
        })
    };

    // fetch data
    const fetchData = async () => {
        setPostsLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/get-posts/${pageNo}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((postsRes) => {
                setPostsLoader(false);
                if (postsRes.success === true) {
                    setPosts(prevItems => [...prevItems, ...postsRes.data.posts]);
                    if (postsRes.data.posts.length > 0) {
                        setPageNo(prevPage => prevPage + 1);
                    } else {

                    }
                } else {
                    setPosts([]);
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
        if (posts.length === 0) {
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
                    <div className='row'>
                        <div className='col-md-3 overflow-auto' style={{ height: '100vh' }}>
                            <ProfileLeftPanel />
                        </div>

                        <div id="scrollableDiv" className="col-md-6 overflow-auto" style={{ height: '100vh' }}>
                            <CreatePostComponent authFlag={authFlag} authToken={authToken} authUser={authUser} newPostAdded={newPostAdded} />

                            <AlertBox alert={alertBox.alert} message={alertBox.message} />

                            <InfiniteScroll
                                dataLength={posts.length}
                                next={fetchData}
                                hasMore={posts.length < 200}
                                loader={<></>}
                                scrollableTarget="scrollableDiv"
                            >
                                {posts.map((post, i) => {
                                    return <ViewPostComponent
                                        key={i}
                                        postIndex={i}
                                        post={post}
                                        updatePostArray={updatePostArray}
                                        deleteFromPostArray={deleteFromPostArray}
                                        authFlag={authFlag}
                                        authToken={authToken}
                                        authUser={authUser} />;
                                })}
                            </InfiniteScroll>

                            {postsLoader ? <div className='text-center mb-2'>
                                <div className="spinner-grow text-primary"></div>
                                <div className="spinner-grow text-success ml-2"></div>
                                <div className="spinner-grow text-info ml-2"></div>
                                <div className="spinner-grow text-warning ml-2"></div>
                                <div className="spinner-grow text-danger ml-2"></div>
                            </div> : <></>}
                        </div>

                        <div className='col-md-3 overflow-auto' style={{ height: '100vh' }}>
                            <RightPanelAds />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}