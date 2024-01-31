import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function AdminLogin(props) {

    // page title
    document.title = 'Welcome to We connect | Admin Login | Authentication Page';

    let basicData = useOutletContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem(process.env.REACT_APP_ADMIN_AUTH_KEY, JSON.stringify(formData));
        setTimeout(() => {
            console.log("REDIRECT");
            window.location.reload();
            // navigate("/admin", { replace: true });
        }, 1000);
    };

    return (
        <>
            <p className="login-box-msg">Sign in to start your session</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
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
                <a href="forgot-password.html">I forgot my password</a>
            </p>
            <p className="mb-0">
                <a href="register.html" className="text-center">Register a new membership</a>
            </p>
        </>
    );
}