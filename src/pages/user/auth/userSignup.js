import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import AlertBox from "../../../components/AlertBox";

// component
export default function UserSignup(props) {

    // page title
    document.title = 'Subha welcomes you | Sign up | Authentication Page';

    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
        submited: false
    });
    const [errors, setErrors] = useState({});
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const handleChange = (event) => {
        setSignupError('');
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const validateForm = (data) => {
        let errors = {};

        // Validation rules
        if (!data.firstName.trim()) {
            errors.firstName = 'Firstname is required.';
        }

        if (!data.lastName.trim()) {
            errors.lastName = 'Lastname is required.';
        }

        if (!data.phone.trim()) {
            errors.phone = 'Phone number is required.';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email address is invalid.';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        } else if (data.password.length > 16) {
            errors.password = 'Password must less then or equal to 16 characters.';
        }

        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        if (!data.terms) {
            errors.terms = 'Please read and accept our terms and conditions.';
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        setLoader(true);
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            }).then((response) => response.json()).then((signupRes) => {
                setLoader(false);
                if (signupRes.success === true) {
                    setSignupSuccess(true);
                } else {
                    setSignupError(signupRes.message);
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: `danger` }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: `${signupRes.message}` }));
                }
            });
        } else {
            setLoader(false);
        }
    };

    return (
        <>
            {!signupSuccess ?
                <>
                    <p className="login-box-msg">Register a new membership</p>
                    <AlertBox alert={alertBox.alert} message={alertBox.message} />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
                            {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
                            {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone no" />
                            {errors.phone && <span className="text-danger">{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                            {errors.password && <span className="text-danger">{errors.password}</span>}
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Retype password" />
                            {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                        </div>
                        <div className="row">
                            {errors.terms && <span className="text-danger ml-2">{errors.terms}</span>}
                            <div className="col-8">
                                <div className="icheck-primary">
                                    <input type="checkbox" id="agreeTerms" name="terms" value="agree" onChange={handleChange} checked={formData.terms} />
                                    <label htmlFor="agreeTerms">
                                        I agree to the <a href="#">terms</a>
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

                        <p className='text-danger'>{signupError}</p>
                    </form>

                    {/* <div className="social-auth-links text-center">
                        <a href="#" className="btn btn-block btn-primary">
                            <i className="fab fa-facebook mr-2"></i>
                            Sign up using Facebook
                        </a>
                        <a href="#" className="btn btn-block btn-danger">
                            <i className="fab fa-google-plus mr-2"></i>
                            Sign up using Google+
                        </a>
                    </div> */}

                    <Link to="/auth/login" className="text-center">I already have a membership</Link>
                </> :
                <>
                    <p className="login-box-msg">Register a new membership</p>
                    <Link to="/auth/login" className="btn btn-primary btn-block">Login</Link>
                </>
            }
        </>
    );
}