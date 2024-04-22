import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate, useParams, Navigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import CreatePostComponent from "../../../components/post/CreatePostComponent";
import ViewPostComponent from '../../../components/post/ViewPostComponent';
import { createAuthSession } from "../../../utils/authHelper";

// component
export default function ViewProfile(props) {
    // page title
    document.title = 'Subha welcomes you | Profile';
    const { authFlag, authToken, authUser } = useOutletContext();
    const { username } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [isFollow, setIsFollow] = useState(false);
    const [followLoader, setFollowLoader] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postsLoader, setPostsLoader] = useState(false);
    const [pageNo, setPageNo] = useState(1);

    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const fetchProfileData = async () => {
        setPostsLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/profile/get-profile/${username}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((profileRes) => {
                setPostsLoader(false);
                if (profileRes.success === true) {
                    setProfile(profileRes.data.profileData);
                    setIsFollow(profileRes.data.youAreFollowing);
                } else {
                    navigate('/feeds', { replace: true });
                }
            });
        } catch (error) {
            navigate('/feeds', { replace: true });
        } finally {
            console.log("FINAL");
        }
    };

    // fetch post data
    const fetchPostData = async () => {
        setPostsLoader(true);
        try {
            let param = `?pageNo=${pageNo}&username=${username}`;
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/get-profile-posts${param}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((postsRes) => {
                if (postsRes.success === true) {
                    setPostsLoader(false);
                    setPosts(prevItems => [...prevItems, ...postsRes.data.posts]);
                    if (postsRes.data.posts.length > 0) {
                        setPageNo(prevPage => prevPage + 1);
                    }
                } else {
                    navigate('/feeds', { replace: true });
                }
            });
        } catch (error) {
            navigate('/feeds', { replace: true });
        } finally {
            console.log("FINAL");
        }
    };

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

    const getDate = (paramDate) => {
        const date = new Date(paramDate);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Add leading zero if month/day is single digit
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    };

    const followUnfollow = async () => {
        setFollowLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/follow/follow-unfollow/${profile._id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((followRes) => {
                if (followRes.success === true) {
                    setIsFollow(followRes.data.youAreFollowing);
                    if(followRes.data.youAreFollowing) {
                        setProfile((prevFormData) => ({ ...prevFormData, followers_count: prevFormData.followers_count + 1 }));
                    } else {
                        setProfile((prevFormData) => ({ ...prevFormData, followers_count: prevFormData.followers_count - 1 }));
                    }
                }
            });
        } catch (error) {
            console.log("ERROR");
        } finally {
            setFollowLoader(false);
            console.log("FINAL");
        }
    };

    useEffect(() => {
        if (authUser.username === username) {
            navigate('/profile', { replace: true });
        } else {
            if (posts.length === 0) {
                fetchProfileData();
                fetchPostData();
            }
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
                                        <li className="breadcrumb-item active">Profile</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-3">

                                    {Object.keys(profile).length > 0 ? <>
                                        <div className="card card-primary card-outline">
                                            <div className="card-body box-profile">
                                                <div className="text-center">
                                                    <div className="profilepic">
                                                        <img className="profile-user-img img-fluid img-circle profilepic__image" id='profilePicture' src={profile.profile_picture_url} alt="Profibild" />
                                                    </div>
                                                </div>
                                                <h3 className="profile-username text-center">{profile.name}</h3>
                                                <p className="text-muted text-center">{profile.bio}</p>
                                                <ul className="list-group list-group-unbordered mb-3">
                                                    <li className="list-group-item">
                                                        <b>Followers</b> <a className="float-right">{profile.followers_count}</a>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Following</b> <a className="float-right">{profile.following_count}</a>
                                                    </li>
                                                </ul>
                                                {isFollow ? <>
                                                    <Link className="btn btn-danger btn-block" onClick={followUnfollow} disable="followLoader">
                                                        {followLoader ? <>
                                                            <div className="spinner-border spinner-border-sm" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </> : <>
                                                            <b>Unfollow</b>
                                                        </>}
                                                    </Link>
                                                </> : <>
                                                    <Link className="btn btn-primary btn-block" onClick={followUnfollow} disable="followLoader">
                                                        {followLoader ? <>
                                                            <div className="spinner-border spinner-border-sm" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </> : <>
                                                            <b>Follow</b>
                                                        </>}
                                                    </Link>
                                                </>}
                                            </div>

                                        </div>
                                    </> : <>
                                    </>}


                                    <div className="card card-primary">
                                        <div className="card-header">
                                            <h3 className="card-title">About Me</h3>
                                        </div>

                                        <div className="card-body">
                                            {profile?.educations?.length > 0 ? <>
                                                <strong><i className="fas fa-book mr-1"></i> Education</strong>
                                                <dl>
                                                    {profile.educations.map((edu, i) => {
                                                        return <React.Fragment key={i}>
                                                            <dd><span className='font-weight-bold'>{edu.degree}</span> from <span className='font-weight-bold'>
                                                                {edu.school_college_university}</span>.
                                                            </dd>
                                                        </React.Fragment>
                                                    })}
                                                </dl>
                                            </> : <>
                                            </>}

                                            <hr />
                                            <strong><i className="fas fa-map-marker-alt mr-1"></i> Location</strong>
                                            <p className="text-muted">{profile.location}</p>
                                            {profile?.skills?.length > 0 ? <>
                                                <strong><i className="fas fa-pencil-alt mr-1"></i> Skills</strong>
                                                <dl>
                                                    {profile.skills.map((skl, i) => {
                                                        return <React.Fragment key={i}>
                                                            <dd>In <span className='font-weight-bold'>{skl.name}</span> I have <span className='font-weight-bold'>
                                                                {skl.year_of_experience} year of experience.</span>.
                                                            </dd>
                                                        </React.Fragment>
                                                    })}
                                                </dl>
                                            </> : <>
                                            </>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-9">
                                    <AlertBox alert={alertBox.alert} message={alertBox.message} />
                                    <div className="card">
                                        <div className="card-header p-2">
                                            <ul className="nav nav-pills">
                                                <li className="nav-item"><a className="nav-link active" href="#activity" data-toggle="tab">Activity</a></li>
                                                {/* <li className="nav-item"><a className="nav-link" href="#timeline" data-toggle="tab">Timeline</a></li>
                                                <li className="nav-item"><a className="nav-link" href="#settings" data-toggle="tab">Settings</a></li> */}
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="active tab-pane" id="activity">
                                                    <AlertBox alert={alertBox.alert} message={alertBox.message} />

                                                    <InfiniteScroll
                                                        dataLength={posts.length}
                                                        next={fetchPostData}
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
                                                                deleteFromPostArray={''}
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

                                                <div className="tab-pane" id="timeline">

                                                    <div className="timeline timeline-inverse">

                                                        <div className="time-label">
                                                            <span className="bg-danger">
                                                                10 Feb. 2014
                                                            </span>
                                                        </div>


                                                        <div>
                                                            <i className="fas fa-envelope bg-primary"></i>
                                                            <div className="timeline-item">
                                                                <span className="time"><i className="far fa-clock"></i> 12:05</span>
                                                                <h3 className="timeline-header"><a href="#">Support Team</a> sent you an email</h3>
                                                                <div className="timeline-body">
                                                                    Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles,
                                                                    weebly ning heekya handango imeem plugg dopplr jibjab, movity
                                                                    jajah plickers sifteo edmodo ifttt zimbra. Babblely odeo kaboodle
                                                                    quora plaxo ideeli hulu weebly balihoo...
                                                                </div>
                                                                <div className="timeline-footer">
                                                                    <a href="#" className="btn btn-primary btn-sm">Read more</a>
                                                                    <a href="#" className="btn btn-danger btn-sm">Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div>
                                                            <i className="fas fa-user bg-info"></i>
                                                            <div className="timeline-item">
                                                                <span className="time"><i className="far fa-clock"></i> 5 mins ago</span>
                                                                <h3 className="timeline-header border-0"><a href="#">Sarah Young</a> accepted your friend request
                                                                </h3>
                                                            </div>
                                                        </div>


                                                        <div>
                                                            <i className="fas fa-comments bg-warning"></i>
                                                            <div className="timeline-item">
                                                                <span className="time"><i className="far fa-clock"></i> 27 mins ago</span>
                                                                <h3 className="timeline-header"><a href="#">Jay White</a> commented on your post</h3>
                                                                <div className="timeline-body">
                                                                    Take me to your leader!
                                                                    Switzerland is small and neutral!
                                                                    We are more like Germany, ambitious and misunderstood!
                                                                </div>
                                                                <div className="timeline-footer">
                                                                    <a href="#" className="btn btn-warning btn-flat btn-sm">View comment</a>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="time-label">
                                                            <span className="bg-success">
                                                                3 Jan. 2014
                                                            </span>
                                                        </div>


                                                        <div>
                                                            <i className="fas fa-camera bg-purple"></i>
                                                            <div className="timeline-item">
                                                                <span className="time"><i className="far fa-clock"></i> 2 days ago</span>
                                                                <h3 className="timeline-header"><a href="#">Mina Lee</a> uploaded new photos</h3>
                                                                <div className="timeline-body">
                                                                    <img src="https://placehold.it/150x100" alt="..." />
                                                                    <img src="https://placehold.it/150x100" alt="..." />
                                                                    <img src="https://placehold.it/150x100" alt="..." />
                                                                    <img src="https://placehold.it/150x100" alt="..." />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <i className="far fa-clock bg-gray"></i>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane" id="settings">

                                                </div>

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