import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function UserLogin(props) {

    // page title
    document.title = 'Welcome to We connect | Login';

    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({ phoneoremail: "", password: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoader(true);
        await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => {
            setLoader(false);
            if (data.success === true) {
                let setAuth = {
                    userdata: data.data.user,
                    token: data.data.access_token
                };
                localStorage.setItem(process.env.REACT_APP_USER_AUTH_KEY, JSON.stringify(setAuth));
                setTimeout(() => {
                    console.log("REDIRECT");
                    window.location.reload();
                    // navigate("/feeds", { replace: true });
                }, 1000);
            } else {

            }
        });
    };

    return (
        <>
            <p className="login-box-msg">Sign in to start your session</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email" name="phoneoremail" value={formData.phoneoremail} onChange={handleChange} />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <span className="fas fa-envelope"></span>
                        </div>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <span className="fas fa-lock"></span>
                        </div>
                    </div>
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
                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                    </div>
                </div>
            </form>

            <div className="social-auth-links text-center mt-2 mb-3">
                <a href="#" className="btn btn-block btn-primary">
                    <i className="fab fa-facebook mr-2"></i> Sign in using Facebook
                </a>
                <a href="#" className="btn btn-block btn-danger">
                    <i className="fab fa-google-plus mr-2"></i> Sign in using Google+
                </a>
            </div>

            <p className="mb-1">
                <Link to="/auth/forgot-password">I forgot my password</Link>
            </p>
            <p className="mb-0">
                <Link to="/auth/signup" className="text-center">Register a new membership</Link>
            </p>
        </>
    );
}