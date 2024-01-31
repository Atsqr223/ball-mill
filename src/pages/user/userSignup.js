import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function UserSignup(props) {

    // page title
    document.title = 'Welcome to We connect | Sign up | Authentication Page';

    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        rePassword: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => {
            setLoader(false);
            console.log(data);
            if (data.success === true) {
                setSignupSuccess(true);
            } else {

            }
        })
    };

    return (
        <>
            {!signupSuccess ?
                <>
                    <p className="login-box-msg">Register a new membership</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone no" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" name="rePassword" value={formData.rePassword} onChange={handleChange} placeholder="Retype password" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="icheck-primary">
                                    <input type="checkbox" id="agreeTerms" name="terms" value="agree" />
                                    <label htmlFor="agreeTerms">
                                        I agree to the <a href="#">terms</a>
                                    </label>
                                </div>
                            </div>
                            <div className="col-4">
                                {!loader ?
                                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                                    :
                                    <button type="button" className="btn btn-primary btn-block">Submitting...</button>
                                }
                            </div>
                        </div>
                    </form>

                    <div className="social-auth-links text-center">
                        <a href="#" className="btn btn-block btn-primary">
                            <i className="fab fa-facebook mr-2"></i>
                            Sign up using Facebook
                        </a>
                        <a href="#" className="btn btn-block btn-danger">
                            <i className="fab fa-google-plus mr-2"></i>
                            Sign up using Google+
                        </a>
                    </div>

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