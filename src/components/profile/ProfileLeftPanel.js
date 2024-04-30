import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import { createAuthSession } from "../../utils/authHelper";

import './profile.css';

// component
export default function ProfileLeftPanel(props) {
    // page title
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
                setAlertBox({ alert: 'success', message: profilePictureRes.message });
                setTimeout(() => {
                    setAlertBox({ alert: '', message: '' });
                }, 5000);
            } else {
                setAlertBox({alert: 'danger', message: profilePictureRes.message });
                setTimeout(() => {
                    setAlertBox({alert: '', message: '' });
                }, 5000);
            }
        });
    }

    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });
    // user form update end

    useEffect(() => {
    }, []);

    return (
        <>
            <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                    <div className="text-center">
                        <div className="profilepic">
                            <img className="profile-user-img img-fluid img-circle profilepic__image" id='profilePicture' src={authUser.profile_picture_url} alt="Profibild" />
                            <div className="profilepic__content" onClick={() => inputProfilePictureFile.current.click()}>
                                <span className="font-weight-bold"><i className="fas fa-camera"></i></span>
                                <span className="font-weight-bold">Change</span>
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
                    <p className="text-muted text-center">{authUser.bio.substring(0, 100) + "..."}</p>
                    <ul className="list-group list-group-unbordered">
                        <li className="list-group-item">
                            <b>Followers</b> <Link to="/profile/followers" className="float-right">{authUser.followers_count}</Link>
                        </li>
                        <li className="list-group-item">
                            <b>Following</b> <Link to="/profile/following" className="float-right">{authUser.following_count}</Link>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="card card-primary">
                <div className="card-header">
                    <h3 className="card-title">About Me</h3>
                </div>

                <div className="card-body">
                    <strong><i className="fas fa-book mr-1"></i> Education</strong>

                    {authUser.educations.map((edu, i) => {
                        return <p className="text-muted" key={i}>
                            {`${edu.degree} from the ${edu.school_college_university}`}
                        </p>
                    })}
                    <hr />
                    <strong><i className="fas fa-map-marker-alt mr-1"></i> Location</strong>
                    <p className="text-muted">{authUser.location}</p>
                    <hr />
                    <strong><i className="fas fa-pencil-alt mr-1"></i> Skills</strong>
                    {authUser.skills.map((skl, i) => {
                        return <p className="text-muted" key={i}>
                            {`${skl.year_of_experience} year of experince in ${skl.name}`}
                        </p>
                    })}
                </div>
            </div>
        </>
    );
}