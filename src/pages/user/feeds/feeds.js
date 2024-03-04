import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import AlertBox from "../../../components/AlertBox";
import CreatePost from "../../../components/CreatePost";
import { utcToLocalTime } from "../../../utils/timeHelper";

// component
export default function Feeds(props) {
    const { authFlag, authToken, authUser } = useOutletContext();

    // page title
    document.title = "Welcome to We connect | Feed's";
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [postsLoader, setPostsLoader] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const fetchDataReset = async () => {
        setPageNo(prevPage => prevPage - pageNo);
        setPosts([]);
        fetchData();
    }

    // fetch data
    const fetchData = async () => {
        setPostsLoader(true);
        try {
            let param = `?page_no=${pageNo}`;
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/get-all${param}`, {
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

    const doLike = (index) => {
        console.log("Like");
    }

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
                            <div className="card card-widget widget-user-2 shadow-sm">
                                {/* <!-- Add the bg color to the header using any of the bg-* classes --> */}
                                <div className="widget-user-header bg-warning">
                                    <div className="widget-user-image">
                                        <img className="img-circle elevation-2" src="/assets/dist/img/user7-128x128.jpg" alt="User Avatar" />
                                    </div>
                                    <h3 className="widget-user-username">{authUser.name}</h3>
                                    <h5 className="widget-user-desc">Lead Developer</h5>
                                </div>
                                <div className="card-footer p-0">
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Friend's <span className="float-right badge bg-primary">31</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Followers <span className="float-right badge bg-info">5</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Following <span className="float-right badge bg-success">12</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Subscribe <span className="float-right badge bg-danger">842</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Likes <span className="float-right badge bg-danger">842</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title text-bold">
                                        Sample 1
                                    </h3>
                                </div>

                                <div className="card-body">
                                    <ul>
                                        <li>Lorem ipsum dolor sit amet</li>
                                        <li>Consectetur adipiscing elit</li>
                                        <li>Nulla volutpat aliquam velit
                                            <ul>
                                                <li>Phasellus iaculis neque</li>
                                                <li>Purus sodales ultricies</li>
                                            </ul>
                                        </li>
                                        <li>Aenean sit amet erat nunc</li>
                                        <li>Eget porttitor lorem</li>
                                        <li>Eget porttitor lorem</li>
                                        <li>Eget porttitor lorem</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div id="scrollableDiv" className="col-md-6 overflow-auto" style={{ height: '100vh' }}>
                            <CreatePost authFlag={authFlag} authToken={authToken} authUser={authUser} fetchDataReset={fetchDataReset} />

                            <AlertBox alert={alertBox.alert} message={alertBox.message} />

                            <InfiniteScroll
                                dataLength={posts.length}
                                next={fetchData}
                                hasMore={posts.length < 200}
                                loader={<></>}
                                scrollableTarget="scrollableDiv"
                            >
                                {posts.map((item, i) => {
                                    return <div key={i} className="card card-widget">
                                        <div className="card-header">
                                            <div className="user-block">
                                                <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
                                                <span className="username"><a href="#">{item.createdBy.name}</a></span>
                                                <span className="description">{utcToLocalTime(item.createdAt)}</span>
                                            </div>

                                            <div className="card-tools">
                                                <button type="button" className="btn btn-tool" data-card-widget="remove">
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <p className="text-justify" dangerouslySetInnerHTML={{ __html: item.content }}></p>
                                            <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                            <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(0)}><i className="far fa-thumbs-up"></i> Like</button>
                                            <button type="button" className="btn btn-default btn-sm ml-1" onClick={() => doLike(0)}><i className="far fa-thumbs-up"></i> Like</button>
                                            <span className="float-right text-muted">127 likes - 3 comments</span>
                                        </div>

                                        <div className="card-footer card-comments">
                                            <div className="card-comment">
                                                <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

                                                <div className="comment-text">
                                                    <span className="username">
                                                        Maria Gonzales
                                                        <span className="text-muted float-right">8:03 PM Today</span>
                                                    </span>
                                                    It is a long established fact that a reader will be distracted
                                                    by the readable content of a page when looking at its layout.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <form action="#" method="post">
                                                <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
                                                {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
                                                <div className="img-push">
                                                    <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
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