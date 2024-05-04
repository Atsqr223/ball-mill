import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import AlertBox from "../../components/common/AlertBox";
import { createAuthSession } from "../../utils/authHelper";

// component
export default function UserSignupOtp(props) {
    const navigate = useNavigate();

    console.log("props :: ", props);

    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });
    const [otpLoader, setOtpLoader] = useState(false);
    const [formOtpData, setFormOtpData] = useState({
        name: props.userData.name,
        phone: props.userData.phone,
        email: props.userData.email,
        otp: '',
        submited: false
    });
    const [signupOtpError, setSignupOtpError] = useState({});
    const [signupOtpApiError, setSignupOtpApiError] = useState('');

    const handleChangeOtp = (event) => {
        setSignupOtpError({});
        const { name, value } = event.target;
        setFormOtpData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const validateFormOtp = (data) => {
        let errors = {};

        // Validation rules
        if (!data.otp.trim()) {
            errors.otp = 'Otp is required.';
        } else if (data.otp.length !== 6) {
            errors.otp = 'Otp is not valid.';
        }

        return errors;
    };

    const handleSubmitOtp = async (event) => {
        event.preventDefault();
        setFormOtpData((prevFormData) => ({ ...prevFormData, submited: true }));
        setOtpLoader(true);
        const validationErrors = validateFormOtp(formOtpData);
        setSignupOtpError(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/auth/signup/verify-otp', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formOtpData)
            }).then((response) => response.json()).then((otpRes) => {
                if (otpRes.success === true) {
                    const setAuth = {
                        userdata: otpRes.data.user,
                        token: otpRes.data.token
                    };
                    createAuthSession(setAuth);
                    setTimeout(() => {
                        console.log("REDIRECT");
                        setOtpLoader(false);
                        window.location.reload();
                    }, 1000);
                } else {
                    setOtpLoader(false);
                    setSignupOtpApiError(otpRes.message);
                    setAlertBox({ alert: `danger`, message: otpRes.message });
                }
            });
        } else {
            setOtpLoader(false);
        }
    };

    return (
        <>
            <p className="login-box-msg">Verify your otp and start your session</p>
            <AlertBox alert={alertBox.alert} message={alertBox.message} />
            <form onSubmit={handleSubmitOtp}>
                <div className="form-group">
                    <label htmlFor="inputLastName" className="col-form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={formOtpData.name} disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="inputLastName" className="col-form-label">Email</label>
                    <input type="text" className="form-control" name="email" value={formOtpData.email} disabled />
                </div>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Enter otp" name="otp" value={formOtpData.otp} onChange={handleChangeOtp} />
                    {signupOtpError.otp && <span className="text-danger">{signupOtpError.otp}</span>}
                </div>

                <div className="row">
                    <div className="col-8">
                    </div>
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary btn-block" disabled={otpLoader}>
                            {otpLoader ? <>
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </> : <>
                                Verify
                            </>}
                        </button>
                    </div>
                </div>

                <p className='text-danger'>{signupOtpApiError}</p>
            </form>
        </>
    );
}