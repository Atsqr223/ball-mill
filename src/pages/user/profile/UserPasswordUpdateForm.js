import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import { createAuthSession } from "../../../utils/authHelper";

// component
export default function UserPasswordUpdateForm(props) {
    // page title
    const { authFlag, authToken, authUser } = props;
    const navigate = useNavigate();

    // user form update start
    const [userFormLoader, setUserFormLoader] = useState(false);

    /***********/
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    // user password update start
    const [userPasswordFormLoader, setUserPasswordFormLoader] = useState(false);
    const [userPasswordForm, setUserPasswordForm] = useState({
        currentPassword: "",
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

        if (!data.confirmPassword) {
            errors.confirmPassword = 'Old Password is required.';
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
                setUserPasswordForm((prevFormData) => ({ ...prevFormData, currentPassword: '' }));
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

    useEffect(() => {
    }, []);

    return (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title">Password</h3>
            </div>

            <div className='m-1'>
                <AlertBox alert={alertBox.alert} message={alertBox.message} />
            </div>

            <form id='updatePassword' className="form-horizontal" onSubmit={updatePassword}>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-4 form-group'>
                            <label htmlFor="inputFirstName" className="col-form-label">Current password</label>
                            <input type="password" className="form-control" name="currentPassword" value={userPasswordForm.currentPassword} onChange={userPasswordFormHandleChange} placeholder="Current password" />
                            {(userPasswordFormErrors.confirmPassword && userPasswordForm.submited) ? <span className="text-danger">{userPasswordFormErrors.currentPassword}</span> : <></>}
                        </div>

                        <div className='col-md-4 form-group'>
                            <label htmlFor="inputLastName" className="col-form-label">New password</label>
                            <input type="password" className="form-control" name="newPassword" value={userPasswordForm.newPassword} onChange={userPasswordFormHandleChange} placeholder="New password" />
                            {userPasswordFormErrors.newPassword && userPasswordForm.submited ? <span className="text-danger">{userPasswordFormErrors.newPassword}</span> : <></>}
                        </div>

                        <div className='col-md-4 form-group'>
                            <label htmlFor="inputLastName" className="col-form-label">Confirm password</label>
                            <input type="password" className="form-control" name="confirmPassword" value={userPasswordForm.confirmPassword} onChange={userPasswordFormHandleChange} placeholder="Confirm password" />
                            {userPasswordFormErrors.confirmPassword && userPasswordForm.submited ? <span className="text-danger">{userPasswordFormErrors.confirmPassword}</span> : <></>}
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button type="submit" className="btn btn-info float-right" disabled={userPasswordFormLoader}>
                        {userPasswordFormLoader ? <>
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