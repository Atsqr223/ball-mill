import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

import AlertBox from "../../../components/common/AlertBox";

// component
export default function UserForgotPassword(props) {

    // page title
    document.title = 'Subha welcomes you | Forgot Password';

    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    // forgot password form
    const [forgotApiSuccess, setForgotApiSuccess] = useState(false);
    const [forgotApiError, setForgotApiError] = useState({
        alert: '',
        message: ''
    });
    const [forgotFormData, setForgotFormData] = useState({
        phoneoremail: "",
        submited: false
    });
    const [forgotFormValidateErrors, setForgotFormValidateErrors] = useState({});
    const forgotFormHandleChange = (event) => {
        const { name, value } = event.target;
        setForgotFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
    const forgotFormValidateForm = (data) => {
        let errors = {};

        if (!data.phoneoremail.trim()) {
            errors.phoneoremail = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.phoneoremail)) {
            errors.phoneoremail = 'Email address is invalid.';
        }

        return errors;
    };
    const forgotFormHandleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        setForgotFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = forgotFormValidateForm(forgotFormData);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(forgotFormData)
            }).then((response) => response.json()).then((forgotRes) => {
                setLoader(false);
                if (forgotRes.success === true) {
                    setForgotApiSuccess(true);
                    setResetFormData((prevFormData) => ({ ...prevFormData, ['email']: forgotRes.data.email }));
                    setResetFormData((prevFormData) => ({ ...prevFormData, ['id']: forgotRes.data._id }));
                    setForgotApiError((prevFormData) => ({ ...prevFormData, ['alert']: `` }));
                    setForgotApiError((prevFormData) => ({ ...prevFormData, ['message']: `` }));
                } else {
                    setForgotApiSuccess(false);
                    setForgotApiError((prevFormData) => ({ ...prevFormData, ['alert']: `danger` }));
                    setForgotApiError((prevFormData) => ({ ...prevFormData, ['message']: forgotRes.message }));
                }
            });
        } else {
            setLoader(false);
            setForgotFormValidateErrors(validationErrors);
        }
    };

    // reset password form
    const [resetApiSuccess, setResetApiSuccess] = useState(false);
    const [resetApiError, setResetApiError] = useState({
        alert: '',
        message: ''
    });
    const [resetFormData, setResetFormData] = useState({
        id: "",
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
        submited: false
    });
    const [resetFormValidateErrors, setResetFormValidateErrors] = useState({});
    const resetFormHandleChange = (event) => {
        const { name, value } = event.target;
        setResetFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
    const resetFormValidateForm = (data) => {
        let errors = {};

        if (!data.otp.trim()) {
            errors.otp = 'Otp is required.';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }

        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        return errors;
    };
    const resetFormHandleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        setResetFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = resetFormValidateForm(resetFormData);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resetFormData)
            }).then((response) => response.json()).then((resetRes) => {
                setLoader(false);
                if (resetRes.success === true) {
                    setResetApiSuccess(true);
                    setResetApiError((prevFormData) => ({ ...prevFormData, ['alert']: `` }));
                    setResetApiError((prevFormData) => ({ ...prevFormData, ['message']: `` }));
                } else {
                    setResetApiSuccess(false);
                    setResetApiError((prevFormData) => ({ ...prevFormData, ['alert']: `danger` }));
                    setResetApiError((prevFormData) => ({ ...prevFormData, ['message']: resetRes.message }));
                }
            });
        } else {
            setLoader(false);
            setResetFormValidateErrors(validationErrors);
        }
    };

    const resendOtp = async (event) => {
        await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(forgotFormData)
        }).then((response) => response.json()).then((forgotRes) => {
            setLoader(false);
            if (forgotRes.success === true) {
                setForgotApiSuccess(true);
                setResetFormData((prevFormData) => ({ ...prevFormData, ['email']: forgotRes.data.email }));
                setResetFormData((prevFormData) => ({ ...prevFormData, ['id']: forgotRes.data._id }));
                setForgotApiError((prevFormData) => ({ ...prevFormData, ['alert']: `` }));
                setForgotApiError((prevFormData) => ({ ...prevFormData, ['message']: `` }));
            } else {
                setForgotApiSuccess(false);
                setForgotApiError((prevFormData) => ({ ...prevFormData, ['alert']: `danger` }));
                setForgotApiError((prevFormData) => ({ ...prevFormData, ['message']: forgotRes.message }));
            }
        });
    };

    return (
        <>
            {!forgotApiSuccess ?
                <>
                    <p className="login-box-msg">Forgot your password</p>
                    <AlertBox alert={forgotApiError.alert} message={forgotApiError.message} />
                    <form onSubmit={forgotFormHandleSubmit}>
                        <div className="form-group">
                            <input type="email" className="form-control" placeholder="Email" name="phoneoremail" value={forgotFormData.phoneoremail} onChange={forgotFormHandleChange} />
                            {forgotFormValidateErrors.phoneoremail && <span className="text-danger">{forgotFormValidateErrors.phoneoremail}</span>}
                        </div>

                        <div className="row">
                            <div className="col-8">
                            </div>
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary btn-block" disabled={loader}>
                                    {!loader ?
                                        `Get OTP` :
                                        `...`
                                    }
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mb-1">
                        <Link to="/auth/login" className="text-center">I already have a membership</Link>
                    </p>
                    <p className="mb-0">
                        <Link to="/auth/signup" className="text-center">Register a new membership</Link>
                    </p>
                </> : <>
                    {!resetApiSuccess ? <>
                        <p className="login-box-msg">Reset your password</p>
                        <AlertBox alert={resetApiError.alert} message={resetApiError.message} />
                        <form onSubmit={resetFormHandleSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="OTP" name="otp" value={resetFormData.otp} onChange={resetFormHandleChange} />
                                {resetFormValidateErrors.otp && <span className="text-danger">{resetFormValidateErrors.otp}</span>}
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" name="password" value={resetFormData.password} onChange={resetFormHandleChange} placeholder="Password" />
                                {resetFormValidateErrors.password && <span className="text-danger">{resetFormValidateErrors.password}</span>}
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" name="confirmPassword" value={resetFormData.rePassword} onChange={resetFormHandleChange} placeholder="Retype password" />
                                {resetFormValidateErrors.confirmPassword && <span className="text-danger">{resetFormValidateErrors.confirmPassword}</span>}
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <button type="button" className="btn btn-primary btn-block" disabled={loader} onClick={resendOtp}>
                                        {!loader ?
                                            `Resend OTP` :
                                            `...`
                                        }
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loader}>
                                        {!loader ?
                                            `Reset Password` :
                                            `...`
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>

                        <p className="mb-1">
                            <Link to="/auth/login" className="text-center">I already have a membership</Link>
                        </p>
                        <p className="mb-0">
                            <Link to="/auth/signup" className="text-center">Register a new membership</Link>
                        </p>
                    </> : <>
                        <p className="login-box-msg">Password reset successfully.</p>
                        <Link to="/auth/login" className="btn btn-primary btn-block">Login</Link>
                    </>}
                </>}
        </>
    );
}