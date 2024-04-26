import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import AlertBox from "../common/AlertBox";
import { createAuthSession } from "../../utils/authHelper";

// component
export default function UserBasicUpdateForm(props) {
    // page title
    const { authFlag, authToken, authUser } = props;
    const navigate = useNavigate();

    // user form update start
    const [userFormLoader, setUserFormLoader] = useState(false);
    const name = authUser.name.split(" ");

    /***********/
    const [userFormData, setUserFormData] = useState({
        firstName: name[0],
        lastName: name[1],
        phone: authUser.phone.toString(),
        education: [],
        location: authUser.location,
        skills: [],
        bio: authUser.bio,
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
                        token: updateProfileRes.data.token
                    };
                    createAuthSession(setAuth);
                    setAlertBox({alert: 'success', message: updateProfileRes.message });
                    setTimeout(() => {
                        setAlertBox({alert: '', message: '' });
                    }, 5000);
                } else {
                    setAlertBox({ alert: 'danger', message: updateProfileRes.message });
                    setTimeout(() => {
                        setAlertBox({alert: '', message: '' });
                    }, 5000);
                }
            });
        } else {
            setUserFormLoader(false);
        }
    };
    // user form update end

    useEffect(() => {
    }, []);

    return (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title">Personal Information</h3>
            </div>

            <div className='m-1'>
                <AlertBox alert={alertBox.alert} message={alertBox.message} />
            </div>

            <form id='updateProfile' className="form-horizontal" onSubmit={updateUser}>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputFirstName" className="col-form-label">First Name</label>
                            <input type="text" className="form-control" name="firstName" value={userFormData.firstName} onChange={userFormHandleChange} placeholder="First name" />
                            {userFormErrors.firstName && userFormData.submited ? <span className="text-danger">{userFormErrors.firstName}</span> : <></>}
                        </div>
                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputLastName" className="col-form-label">Last Name</label>
                            <input type="text" className="form-control" name="lastName" value={userFormData.lastName} onChange={userFormHandleChange} placeholder="Last name" />
                            {userFormErrors.lastName && userFormData.submited ? <span className="text-danger">{userFormErrors.lastName}</span> : <></>}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputEmail" className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={userFormData.email} onChange={userFormHandleChange} placeholder="Email" disabled={true} />
                            {userFormErrors.email && userFormData.submited ? <span className="text-danger">{userFormErrors.email}</span> : <></>}
                        </div>
                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputPhoneNumber" className="form-label">Phone</label>
                            <input type="text" className="form-control" name="phone" value={userFormData.phone} onChange={userFormHandleChange} placeholder="Phone no" disabled={true} />
                            {userFormErrors.phone && userFormData.submited ? <span className="text-danger">{userFormErrors.phone}</span> : <></>}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputLocation" className="col-form-label">Location</label>
                            <input type="text" className="form-control" name="location" value={userFormData.location} onChange={userFormHandleChange} placeholder="Location" />
                            {userFormErrors.location && userFormData.submited ? <span className="text-danger">{userFormErrors.location}</span> : <></>}
                        </div>

                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputLocation" className="col-form-label">Bio</label>
                            <textarea type="text" className="form-control" name="bio" value={userFormData.bio} onChange={userFormHandleChange} placeholder="Bio"></textarea>
                            {userFormErrors.bio && userFormData.submited ? <span className="text-danger">{userFormErrors.bio}</span> : <></>}
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button type="submit" className="btn btn-info float-right" disabled={userFormLoader}>
                        {userFormLoader ? <>
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </> : <>
                            Update
                        </>}
                    </button>
                </div>
            </form>
        </div>
    );
}