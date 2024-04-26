import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";

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
            let param = `?pageNo=${pageNo}`;
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/get-posts${param}`, {
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
                            <div className="card">
                                <div className="card-body">
                                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                        <ol className="carousel-indicators">
                                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                                        </ol>
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <img className="d-block w-100" src="https://placehold.it/900x500/39CCCC/ffffff&text=I+Love+Bootstrap" alt="First slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="https://placehold.it/900x500/3c8dbc/ffffff&text=I+Love+Bootstrap" alt="Second slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="https://placehold.it/900x500/f39c12/ffffff&text=I+Love+Bootstrap" alt="Third slide" />
                                            </div>
                                        </div>
                                        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                            <span className="carousel-control-custom-icon" aria-hidden="true">
                                                <i className="fas fa-chevron-left"></i>
                                            </span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                            <span className="carousel-control-custom-icon" aria-hidden="true">
                                                <i className="fas fa-chevron-right"></i>
                                            </span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-2">
                                <img className="card-img-top" src="/assets/dist/img/photo3.jpg" alt="Dist Photo 3" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title text-primary">Card Title</h5>
                                    <p className="card-text pb-1 pt-1 text-white">
                                        Lorem ipsum dolor <br />
                                        sit amet, consectetur <br />
                                        adipisicing elit sed <br />
                                        do eiusmod tempor. </p>
                                    <a href="#" className="text-primary">Last update 3 days ago</a>
                                </div>
                            </div>

                            <div className="card mb-2 bg-gradient-dark">
                                <img className="card-img-top" src="/assets/dist/img/photo1.png" alt="Dist Photo 1" />
                                <div className="card-img-overlay d-flex flex-column justify-content-end">
                                    <h5 className="card-title text-primary text-white">Card Title</h5>
                                    <p className="card-text text-white pb-2 pt-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor.</p>
                                    <a href="#" className="text-white">Last update 2 mins ago</a>
                                </div>
                            </div>

                            <div className="card mb-2">
                                <img className="card-img-top" src="/assets/dist/img/photo3.jpg" alt="Dist Photo 3" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title text-primary">Card Title</h5>
                                    <p className="card-text pb-1 pt-1 text-white">
                                        Lorem ipsum dolor <br />
                                        sit amet, consectetur <br />
                                        adipisicing elit sed <br />
                                        do eiusmod tempor. </p>
                                    <a href="#" className="text-primary">Last update 3 days ago</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}