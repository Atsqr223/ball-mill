import React, { useState } from 'react';
import { Link } from "react-router-dom";
import AlertBox from "../../../components/common/AlertBox";
import UserSignupOtp from "../../../components/auth/UserSignupOtp";
import { createAuthSession } from "../../../utils/authHelper";

// component
export default function UserLogin(props) {

    // page title
    document.title = 'TCS welcomes you | Login';

    const [loader, setLoader] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginNotSuccess, setLoginNotSuccess] = useState(false);
    const [userData, setUserData] = useState({});
    const [loginError, setLoginError] = useState('');
    const [formData, setFormData] = useState({
        phoneoremail: "",
        password: "",
        submited: false
    });
    const [errors, setErrors] = useState({});
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const validateForm = (data) => {
        let errors = {};

        if (!data.phoneoremail.trim()) {
            errors.phoneoremail = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.phoneoremail)) {
            errors.phoneoremail = 'Email address is invalid.';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }

        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoader(true);
        setFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            // Hardcoded authentication check
            if (formData.phoneoremail === 'mtestercool@gmail.com' && formData.password === 'tcs12345') {
                setLoader(false);
                setLoginSuccess(true);
                const user = {
                    email: 'mtestercool@gmail.com',
                    status: { name: 'Active' }
                };
                setUserData(user);
                const setAuth = {
                    userdata: user,
                    token: 'dummyToken'
                };
                createAuthSession(setAuth);
                setTimeout(() => {
                    console.log("REDIRECT");
                    window.location.reload();
                }, 1000);
            } else {
                setLoader(false);
                setLoginError('Invalid credentials.');
                setAlertBox({ alert: 'danger', message: 'Invalid credentials.' });
            }
        } else {
            setLoader(false);
            setErrors(validationErrors);
        }
    };

    return (
        <>
            {!loginNotSuccess ?
                <>
                    <p className="login-box-msg">Sign in to start your session</p>
                    <AlertBox alert={alertBox.alert} message={alertBox.message} />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="email" className="form-control" placeholder="Email" name="phoneoremail" value={formData.phoneoremail} onChange={handleChange} />
                            {errors.phoneoremail && <span className="text-danger">{errors.phoneoremail}</span>}
                        </div>

                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                            {errors.password && <span className="text-danger">{errors.password}</span>}
                        </div>

                        <div className="row">
                            <div className="col-8">
                                <div className="icheck-primary">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember">
                                        Remember Me
                                    </label>
                                </div>
                            </div>
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary btn-block" disabled={loader}>
                                    {loader ? <>
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </> : <>
                                        Let's go
                                    </>}
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mb-1">
                        <Link to="/auth/forgot-password">I forgot my password</Link>
                    </p>
                    <p className="mb-0">
                        <Link to="/auth/signup" className="text-center">Register a new membership</Link>
                    </p>
                </> : <>
                    <UserSignupOtp userData={userData} />
                </>}
        </>
    );
}
