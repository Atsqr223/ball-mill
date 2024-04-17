import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import { createAuthSession } from "../../../utils/authHelper";

// component
export default function ProfileUpdateForm(props) {
    // page title
    const { authFlag, authToken, authUser } = props;
    const navigate = useNavigate();

    // user form update start
    const [userFormLoader, setUserFormLoader] = useState(false);
    const name = authUser.name.split(" ");
    const [userEducationFormData, setUserEducationFormData] = useState({
        school_college_university: '',
        degree: '',
        start_year: '',
        end_year: '',
        bio: '',
        submited: false
    });
    const [userEducationFormErrors, setUserEducationFormErrors] = useState({});
    const userFormEducationHandleChange = (event) => {
        const { name, value } = event.target;
        setUserEducationFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        const validationErrors = validateUserEducationForm(userEducationFormData);
        setUserEducationFormErrors(validationErrors);
    };
    const validateUserEducationForm = (data) => {
        let errors = {};

        // Validation rules
        if (!data.school_college_university.trim()) {
            errors.school_college_university = 'School/College/University is required.';
        }

        if (!data.degree.trim()) {
            errors.degree = 'Degree is required.';
        }

        if (!data.start_year.trim()) {
            errors.start_year = 'Start year is required.';
        }

        if (!data.end_year.trim()) {
            errors.end_year = 'End year is required.';
        }

        if (!data.bio.trim()) {
            errors.bio = 'Description is required.';
        }

        return errors;
    };
    const addNewEducation = () => {
        setUserEducationFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = validateUserEducationForm(userEducationFormData);
        setUserEducationFormErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            let newArray = [...userFormData.education, {
                school_college_university: userEducationFormData.school_college_university,
                degree: userEducationFormData.degree,
                start_year: userEducationFormData.start_year,
                end_year: userEducationFormData.end_year,
                bio: userEducationFormData.bio,
            }]; // Add a new element to the array
            setUserFormData(prevState => ({
                ...prevState,
                education: newArray
            }));

            const newState = {};
            for (const key in userEducationFormData) {
                newState[key] = '';
            }
            setUserEducationFormData(newState);
        }
    };

    const deleteEducation = (indexToRemove) => {
        Swal.fire({
            title: `Do you want to delete ${userFormData.education[indexToRemove].school_college_university} ?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                setUserFormData(prevState => ({
                    ...prevState,
                    education: prevState.education.filter((item, index) => index !== indexToRemove)
                }));
            } else {
                console.log('Logout cancel.');
            }
        });
    };

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
                        token: updateProfileRes.data.access_token
                    };
                    createAuthSession(setAuth);
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'success' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: updateProfileRes.message }));
                    setTimeout(() => {
                        setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                        setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
                    }, 5000);
                } else {
                    setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
                    setAlertBox((prevFormData) => ({ ...prevFormData, message: updateProfileRes.message }));
                    setTimeout(() => {
                        setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
                        setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
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
                    </div>

                    <h3>Education</h3>
                    <hr />

                    <div className='row'>
                        <div className='col-md-12'>
                            {userFormData.education.length > 0 ? <>
                                {userFormData.education.map((edu, i) => {
                                    return <React.Fragment key={i}>
                                        <div className='row'>
                                            <div className='col-md-9 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">School/College/University</label>
                                                <input type="text" className="form-control" value={edu.school_college_university} disabled />
                                            </div>

                                            <div className='col-md-3 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">Degree/Certificate</label>
                                                <input type="text" className="form-control" value={edu.degree} disabled />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-2 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">Start year</label>
                                                <input type="text" className="form-control" value={edu.start_year} disabled />
                                            </div>

                                            <div className='col-md-2 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">End Year</label>
                                                <input type="text" className="form-control" value={edu.end_year} disabled />
                                            </div>

                                            <div className='col-md-8 form-group'>
                                                <label htmlFor="inputBio" className="col-form-label">Details</label>
                                                <textarea type="text" className="form-control" value={edu.bio} disabled></textarea>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <button type="button" className="btn btn-danger float-right" onClick={() => deleteEducation(i)}>
                                                Delete Education
                                            </button>
                                        </div>

                                        <hr />
                                    </React.Fragment>
                                })}
                            </> : <>
                                <p>Add education to show here.</p>
                            </>}
                        </div>
                    </div>

                    <hr />

                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-9 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">School/College/University</label>
                                    <input type="text" className="form-control" name="school_college_university" value={userEducationFormData.school_college_university} onChange={userFormEducationHandleChange} placeholder="Highest education qualification" />
                                    {userEducationFormErrors.school_college_university && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.school_college_university}</span> : <></>}
                                </div>

                                <div className='col-md-3 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">Degree/Certificate</label>
                                    <input type="text" className="form-control" name="degree" value={userEducationFormData.degree} onChange={userFormEducationHandleChange} placeholder="Degree" />
                                    {userEducationFormErrors.degree && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.degree}</span> : <></>}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-2 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">Start year</label>
                                    <input type="text" className="form-control" name="start_year" value={userEducationFormData.start_year} onChange={userFormEducationHandleChange} placeholder="Start year" />
                                    {userEducationFormErrors.start_year && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.start_year}</span> : <></>}
                                </div>

                                <div className='col-md-2 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">End Year</label>
                                    <input type="text" className="form-control" name="end_year" value={userEducationFormData.end_year} onChange={userFormEducationHandleChange} placeholder="End year" />
                                    {userEducationFormErrors.end_year && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.end_year}</span> : <></>}
                                </div>

                                <div className='col-md-8 form-group'>
                                    <label htmlFor="inputBio" className="col-form-label">Details</label>
                                    <textarea type="text" className="form-control" name="bio" value={userEducationFormData.bio} onChange={userFormEducationHandleChange} placeholder="Bio"></textarea>
                                    {userEducationFormErrors.bio && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.bio}</span> : <></>}
                                </div>
                            </div>

                            <button type="button" className="btn btn-info float-right" onClick={addNewEducation}>
                                Add Education
                            </button>
                        </div>
                    </div>
                    <hr />

                    <div className='row'>
                        <div className='col-md-6 form-group'>
                            <label htmlFor="inputSkills" className="col-form-label">Skills</label>
                            <input type="text" className="form-control" name="skills" value={userFormData.skills} onChange={userFormHandleChange} placeholder="Skills" />
                            {userFormErrors.skills && userFormData.submited ? <span className="text-danger">{userFormErrors.skills}</span> : <></>}
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