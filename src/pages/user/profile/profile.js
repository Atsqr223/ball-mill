import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import { createAuthSession } from "../../../utils/authHelper";

// component
export default function Profile(props) {
    // page title
    document.title = 'Subha welcomes you | Profile';
    const { authFlag, authToken, authUser } = useOutletContext();
    const navigate = useNavigate();

    const inputProfilePictureFile = useRef(null);
    const [profilePicture, setProfilePicture] = useState([]);
    const selectProfilePicture = async (e) => {
        let formData = new FormData();    //formdata object
        formData.append('image', e.target.files[0]);

        await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/profile/profile-picture-update`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': authToken
            },
            body: formData
        }).then((response) => response.json()).then((profilePictureRes) => {
            inputProfilePictureFile.current.value = "";
            inputProfilePictureFile.current.type = "text";
            inputProfilePictureFile.current.type = "file";
            if (profilePictureRes.success === true) {
                document.getElementById("profilePicture").src = profilePictureRes.data.user.profile_picture_url;
                const setAuth = {
                    userdata: profilePictureRes.data.user,
                    token: profilePictureRes.data.access_token
                };
                createAuthSession(setAuth);
                setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'success' }));
                setAlertBox((prevFormData) => ({ ...prevFormData, message: profilePictureRes.message }));
                setTimeout(() => {
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                }, 5000);
            } else {
                setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
                setAlertBox((prevFormData) => ({ ...prevFormData, message: profilePictureRes.message }));
                setTimeout(() => {
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                }, 5000);
            }
        });
    }

    // user form update start
    const [userFormLoader, setUserFormLoader] = useState(false);
    const name = authUser.name.split(" ");
    const [userFormData, setUserFormData] = useState({
        firstName: name[0],
        lastName: name[1],
        phone: authUser.phone.toString(),
        email: authUser.email,
        submited: false
    });
    const [userFormErrors, setUserFormErrors] = useState({});
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const userFormHandleChange = (event) => {
        const { name, value } = event.target;
        setUserFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        const validationErrors = validateUserForm(userFormData);
        setUserFormErrors(validationErrors);
    };

    const validateUserForm = (data) => {
        let errors = {};

        // Validation rules
        if (!data.firstName.trim()) {
            errors.firstName = 'First name is required.';
        }

        if (!data.lastName.trim()) {
            errors.lastName = 'Last name is required.';
        }

        if (!data.phone.trim()) {
            errors.phone = 'Phone number is required.';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email address is invalid.';
        }

        return errors;
    };

    const updateUser = async (event) => {
        event.preventDefault();
        setUserFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        setUserFormLoader(true);
        const validationErrors = validateUserForm(userFormData);
        setUserFormErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/profile/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(userFormData)
            }).then((response) => response.json()).then((updateProfileRes) => {
                document.getElementById("updateProfile").reset();
                setUserFormData((prevFormData) => ({ ...prevFormData, submited: false }));
                setUserFormLoader(false);
                if (updateProfileRes.success === true) {
                    const setAuth = {
                        userdata: updateProfileRes.data.user,
                        token: updateProfileRes.data.access_token
                    };
                    createAuthSession(setAuth);
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'success' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: updateProfileRes.message }));
                    setTimeout(() => {
                        setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                        setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                    }, 5000);
                } else {
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: updateProfileRes.message }));
                    setTimeout(() => {
                        setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                        setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                    }, 5000);
                }
            });
        } else {
            setUserFormLoader(false);
        }
    };
    // user form update end

    // user password update start
    const [userPasswordFormLoader, setUserPasswordFormLoader] = useState(false);
    const [userPasswordForm, setUserPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        submited: false
    });
    const [userPasswordFormErrors, setUserPasswordFormErrors] = useState({});

    const userPasswordFormHandleChange = (event) => {
        const { name, value } = event.target;
        setUserPasswordForm((prevFormData) => ({ ...prevFormData, [name]: value }));
        const validationErrors = validatePasswordForm(userPasswordForm);
        setUserPasswordFormErrors(validationErrors);
    };

    function validatePasswordForm(data) {
        let errors = {};

        if (!data.oldPassword) {
            errors.oldPassword = 'Old Password is required.';
        }

        if (!data.newPassword) {
            errors.newPassword = 'New Password is required.';
        } else if (data.newPassword.length < 6) {
            errors.newPassword = 'New Password must be at least 6 characters long.';
        } else if (data.newPassword.length > 16) {
            errors.newPassword = 'Password must less then or equal to 16 characters.';
        }

        if (data.newPassword !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        return errors;
    }

    const updatePassword = async (event) => {
        event.preventDefault();
        setUserPasswordForm((prevFormData) => ({ ...prevFormData, submited: true }));
        setUserPasswordFormLoader(true);
        const validationErrors = validatePasswordForm(userPasswordForm);
        setUserPasswordFormErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/profile/update-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(userPasswordForm)
            }).then((response) => response.json()).then((passwordUpdateRes) => {
                document.getElementById("updatePassword").reset();
                setUserPasswordForm((prevFormData) => ({ ...prevFormData, oldPassword: '' }));
                setUserPasswordForm((prevFormData) => ({ ...prevFormData, newPassword: '' }));
                setUserPasswordForm((prevFormData) => ({ ...prevFormData, confirmPassword: '' }));
                setUserPasswordForm((prevFormData) => ({ ...prevFormData, submited: false }));
                setUserPasswordFormLoader(false);
                if (passwordUpdateRes.success === true) {
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'success' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: passwordUpdateRes.message }));
                    setTimeout(() => {
                        setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                        setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                    }, 5000);
                } else {
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: passwordUpdateRes.message }));
                    setTimeout(() => {
                        setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                        setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                    }, 5000);
                }
            });
        } else {
            setUserPasswordFormLoader(false);
        }
    };
    // user password update end

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

                                    <div className="card card-primary card-outline">
                                        <div className="card-body box-profile">
                                            <div className="text-center">
                                                <div class="profilepic">
                                                    <img class="profile-user-img img-fluid img-circle profilepic__image" id='profilePicture' src={authUser.profile_picture_url} alt="Profibild" />
                                                    <div class="profilepic__content" onClick={() => inputProfilePictureFile.current.click()}>
                                                        <span class="profilepic__icon"><i class="fas fa-camera"></i></span>
                                                        <span class="profilepic__text">Edit Profile</span>
                                                    </div>
                                                </div>
                                                {/* <img className="profile-user-img img-fluid img-circle"
                                                    src={authUser.profile_picture_url}
                                                    alt="User profile picture"
                                                    onClick={() => inputProfilePictureFile.current.click()}
                                                    onMouseOver={({ target }) => target.style.color = "white"}
                                                    onMouseOut={({ target }) => target.style.color = "black"} /> */}

                                                <input
                                                    type="file"
                                                    onChange={selectProfilePicture}
                                                    ref={inputProfilePictureFile}
                                                    style={{ display: 'none' }} />


                                            </div>
                                            <h3 className="profile-username text-center">{authUser.name}</h3>
                                            <p className="text-muted text-center">Software Engineer</p>
                                            <ul className="list-group list-group-unbordered mb-3">
                                                <li className="list-group-item">
                                                    <b>Followers</b> <a className="float-right">1,322</a>
                                                </li>
                                                <li className="list-group-item">
                                                    <b>Following</b> <a className="float-right">543</a>
                                                </li>
                                                <li className="list-group-item">
                                                    <b>Friends</b> <a className="float-right">13,287</a>
                                                </li>
                                            </ul>
                                            <a href="#" className="btn btn-primary btn-block"><b>Follow</b></a>
                                        </div>

                                    </div>


                                    <div className="card card-primary">
                                        <div className="card-header">
                                            <h3 className="card-title">About Me</h3>
                                        </div>

                                        <div className="card-body">
                                            <strong><i className="fas fa-book mr-1"></i> Education</strong>
                                            <p className="text-muted">
                                                B.S. in Computer Science from the University of Tennessee at Knoxville
                                            </p>
                                            <hr />
                                            <strong><i className="fas fa-map-marker-alt mr-1"></i> Location</strong>
                                            <p className="text-muted">Malibu, California</p>
                                            <hr />
                                            <strong><i className="fas fa-pencil-alt mr-1"></i> Skills</strong>
                                            <p className="text-muted">
                                                <span className="tag tag-danger">UI Design</span>
                                                <span className="tag tag-success">Coding</span>
                                                <span className="tag tag-info">Javascript</span>
                                                <span className="tag tag-warning">PHP</span>
                                                <span className="tag tag-primary">Node.js</span>
                                            </p>
                                            <hr />
                                            <strong><i className="far fa-file-alt mr-1"></i> Notes</strong>
                                            <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum enim neque.</p>
                                        </div>

                                    </div>

                                </div>

                                <div className="col-md-9">
                                    <AlertBox alert={alertBox.alert} message={alertBox.message} />
                                    <div className="card">
                                        <div className="card-header p-2">
                                            <ul className="nav nav-pills">
                                                <li className="nav-item"><a className="nav-link active" href="#activity" data-toggle="tab">Activity</a></li>
                                                <li className="nav-item"><a className="nav-link" href="#timeline" data-toggle="tab">Timeline</a></li>
                                                <li className="nav-item"><a className="nav-link" href="#settings" data-toggle="tab">Settings</a></li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="active tab-pane" id="activity">

                                                    <div className="post">
                                                        <div className="user-block">
                                                            <img className="img-circle img-bordered-sm" src="/assets/dist/img/user1-128x128.jpg" alt="user image" />
                                                            <span className="username">
                                                                <a href="#">Jonathan Burke Jr.</a>
                                                                <a href="#" className="float-right btn-tool"><i className="fas fa-times"></i></a>
                                                            </span>
                                                            <span className="description">Shared publicly - 7:30 PM today</span>
                                                        </div>

                                                        <p>
                                                            Lorem ipsum represents a long-held tradition for designers,
                                                            typographers and the like. Some people hate it and argue for
                                                            its demise, but others ignore the hate as they create awesome
                                                            tools to help create filler text for everyone from bacon lovers
                                                            to Charlie Sheen fans.
                                                        </p>
                                                        <p>
                                                            <a href="#" className="link-black text-sm mr-2"><i className="fas fa-share mr-1"></i> Share</a>
                                                            <a href="#" className="link-black text-sm"><i className="far fa-thumbs-up mr-1"></i> Like</a>
                                                            <span className="float-right">
                                                                <a href="#" className="link-black text-sm">
                                                                    <i className="far fa-comments mr-1"></i> Comments (5)
                                                                </a>
                                                            </span>
                                                        </p>
                                                        <input className="form-control form-control-sm" type="text" placeholder="Type a comment" />
                                                    </div>


                                                    <div className="post clearfix">
                                                        <div className="user-block">
                                                            <img className="img-circle img-bordered-sm" src="/assets/dist/img/user7-128x128.jpg" alt="User Image" />
                                                            <span className="username">
                                                                <a href="#">Sarah Ross</a>
                                                                <a href="#" className="float-right btn-tool"><i className="fas fa-times"></i></a>
                                                            </span>
                                                            <span className="description">Sent you a message - 3 days ago</span>
                                                        </div>

                                                        <p>
                                                            Lorem ipsum represents a long-held tradition for designers,
                                                            typographers and the like. Some people hate it and argue for
                                                            its demise, but others ignore the hate as they create awesome
                                                            tools to help create filler text for everyone from bacon lovers
                                                            to Charlie Sheen fans.
                                                        </p>
                                                        <form className="form-horizontal">
                                                            <div className="input-group input-group-sm mb-0">
                                                                <input className="form-control form-control-sm" placeholder="Response" />
                                                                <div className="input-group-append">
                                                                    <button type="submit" className="btn btn-danger">Send</button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>


                                                    <div className="post">
                                                        <div className="user-block">
                                                            <img className="img-circle img-bordered-sm" src="/assets/dist/img/user6-128x128.jpg" alt="User Image" />
                                                            <span className="username">
                                                                <a href="#">Adam Jones</a>
                                                                <a href="#" className="float-right btn-tool"><i className="fas fa-times"></i></a>
                                                            </span>
                                                            <span className="description">Posted 5 photos - 5 days ago</span>
                                                        </div>

                                                        <div className="row mb-3">
                                                            <div className="col-sm-6">
                                                                <img className="img-fluid" src="/assets/dist/img/photo1.png" alt="Photo" />
                                                            </div>

                                                            <div className="col-sm-6">
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <img className="img-fluid mb-3" src="/assets/dist/img/photo2.png" alt="Photo" />
                                                                        <img className="img-fluid" src="/assets/dist/img/photo3.jpg" alt="Photo" />
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <img className="img-fluid mb-3" src="/assets/dist/img/photo4.jpg" alt="Photo" />
                                                                        <img className="img-fluid" src="/assets/dist/img/photo1.png" alt="Photo" />
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                        <p>
                                                            <a href="#" className="link-black text-sm mr-2"><i className="fas fa-share mr-1"></i> Share</a>
                                                            <a href="#" className="link-black text-sm"><i className="far fa-thumbs-up mr-1"></i> Like</a>
                                                            <span className="float-right">
                                                                <a href="#" className="link-black text-sm">
                                                                    <i className="far fa-comments mr-1"></i> Comments (5)
                                                                </a>
                                                            </span>
                                                        </p>
                                                        <input className="form-control form-control-sm" type="text" placeholder="Type a comment" />
                                                    </div>

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
                                                    <form id='updateProfile' className="form-horizontal" onSubmit={updateUser}>
                                                        <div className="form-group row">
                                                            <label htmlFor="inputName" className="col-sm-2 col-form-label">First Name</label>
                                                            <div className="col-sm-10">
                                                                <input type="text" className="form-control" name="firstName" value={userFormData.firstName} onChange={userFormHandleChange} placeholder="First name" />
                                                                {userFormErrors.firstName && userFormData.submited ? <span className="text-danger">{userFormErrors.firstName}</span> : <></>}
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="inputName" className="col-sm-2 col-form-label">Last Name</label>
                                                            <div className="col-sm-10">
                                                                <input type="text" className="form-control" name="lastName" value={userFormData.lastName} onChange={userFormHandleChange} placeholder="NLast name" />
                                                                {userFormErrors.lastName && userFormData.submited ? <span className="text-danger">{userFormErrors.lastName}</span> : <></>}
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                                                            <div className="col-sm-10">
                                                                <input type="email" className="form-control" name="email" value={userFormData.email} onChange={userFormHandleChange} placeholder="Email" />
                                                                {userFormErrors.email && userFormData.submited ? <span className="text-danger">{userFormErrors.email}</span> : <></>}
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Phone</label>
                                                            <div className="col-sm-10">
                                                                <input type="text" className="form-control" name="phone" value={userFormData.phone} onChange={userFormHandleChange} placeholder="Phone no" />
                                                                {userFormErrors.phone && userFormData.submited ? <span className="text-danger">{userFormErrors.phone}</span> : <></>}
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <div className="offset-sm-2 col-sm-10">
                                                                <button type="submit" className="btn btn-danger" disabled={userFormLoader}>
                                                                    {userFormLoader ? <>
                                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                    </> : <>
                                                                        Update
                                                                    </>}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>

                                                    <form id='updatePassword' className="form-horizontal" onSubmit={updatePassword}>
                                                        <div className="form-group row">
                                                            <label htmlFor="inputName" className="col-sm-2 col-form-label">Old Password</label>
                                                            <div className="col-sm-10">
                                                                <input type="password" className="form-control" name="oldPassword" value={userPasswordForm.oldPassword} onChange={userPasswordFormHandleChange} placeholder="Old Password" />
                                                                {(userPasswordFormErrors.oldPassword && userPasswordForm.submited) ? <span className="text-danger">{userPasswordFormErrors.oldPassword}</span> : <></>}
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">New Password</label>
                                                            <div className="col-sm-10">
                                                                <input type="password" className="form-control" name="newPassword" value={userPasswordForm.newPassword} onChange={userPasswordFormHandleChange} placeholder="New Password" />
                                                                {userPasswordFormErrors.newPassword && userPasswordForm.submited ? <span className="text-danger">{userPasswordFormErrors.newPassword}</span> : <></>}
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Confirm Password</label>
                                                            <div className="col-sm-10">
                                                                <input type="password" className="form-control" name="confirmPassword" value={userPasswordForm.confirmPassword} onChange={userPasswordFormHandleChange} placeholder="Confirm Password" />
                                                                {userPasswordFormErrors.confirmPassword && userPasswordForm.submited ? <span className="text-danger">{userPasswordFormErrors.confirmPassword}</span> : <></>}
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <div className="offset-sm-2 col-sm-10">
                                                                <button type="submit" className="btn btn-danger" disabled={userPasswordFormLoader}>
                                                                    {userPasswordFormLoader ? <>
                                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                    </> : <>
                                                                        Update
                                                                    </>}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
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