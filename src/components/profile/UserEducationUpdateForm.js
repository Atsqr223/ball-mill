import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import AlertBox from "../common/AlertBox";
import UserEducationUpdateView from "./UserEducationUpdateView";
import { createAuthSession } from "../../utils/authHelper";

// component
export default function UserEducationUpdateForm(props) {
    // page title
    const { authFlag, authToken, authUser } = props;
    const navigate = useNavigate();

    // user form update start
    const [userFormLoader, setUserFormLoader] = useState(false);
    const [userEducationFormData, setUserEducationFormData] = useState({
        school_college_university: '',
        degree: '',
        start_date: '',
        end_date: '',
        description: '',
        submited: false
    });
    const [educationLoader, setEducationLoader] = useState(true);
    const [userEducation, setUserEducation] = useState([]);
    const [userEducationFormErrors, setUserEducationFormErrors] = useState({});
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });
    const userFormEducationHandleChange = (event) => {
        const { name, value } = event.target;
        setUserEducationFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        const validationErrors = validateUserEducationForm(userEducationFormData);
        setUserEducationFormErrors(validationErrors);

        if (name == 'start_date') {
            setUserEducationFormData((prevFormData) => ({ ...prevFormData, ['end_date']: '' }));
        }
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

        if (!data.start_date.trim()) {
            errors.start_date = 'Start year is required.';
        }

        if (!data.end_date.trim()) {
            errors.end_date = 'End year is required.';
        }

        if (!data.description.trim()) {
            errors.description = 'Description is required.';
        }

        return errors;
    };
    const addNewEducation = async (event) => {
        event.preventDefault();
        setUserEducationFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = validateUserEducationForm(userEducationFormData);
        setUserEducationFormErrors(validationErrors);
        setUserFormLoader(true);
        if (Object.keys(validationErrors).length === 0) {
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/profile/create-education', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(userEducationFormData)
            }).then((response) => response.json()).then((updateEducationRes) => {
                setUserEducationFormData((prevFormData) => ({ ...prevFormData, submited: false }));
                setUserFormLoader(false);
                if (updateEducationRes.success === true) {
                    const setAuth = {
                        userdata: updateEducationRes.data.user,
                        token: updateEducationRes.data.token
                    };
                    createAuthSession(setAuth);
                    setUserEducation(prevState => ([
                        ...prevState,
                        updateEducationRes.data.new_education
                    ]));

                    const newState = {};
                    for (const key in userEducationFormData) {
                        newState[key] = '';
                    }
                    setUserEducationFormData(newState);

                    setAlertBox({ alert: 'success', message: updateEducationRes.message });
                    setTimeout(() => {
                        setAlertBox({ alert: '', message: '' });
                    }, 5000);
                } else {
                    setAlertBox({ alert: 'danger', message: updateEducationRes.message });
                    setTimeout(() => {
                        setAlertBox({ alert: '', message: '' });
                    }, 5000);
                }
            });
        } else {
            setUserFormLoader(false);
        }
    };

    // Function to get the current date in the format YYYY-MM-DD
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Add leading zero if month/day is single digit
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    };

    // fetch data
    const fetchEducationData = async () => {
        setEducationLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/profile/get-education`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((postsRes) => {
                setEducationLoader(false);
                if (postsRes.success === true) {
                    setUserEducation(prevItems => [...prevItems, ...postsRes.data.educations]);
                } else {
                    setUserEducation([]);
                }
            });
        } catch (error) {
            setEducationLoader(false);
            setAlertBox({ alert: 'danger', message: 'An error occord.' });
        } finally {
            setEducationLoader(false);
        }
    };

    const deleteEducation = (education, updateEducationRes) => {
        if (updateEducationRes.success === true) {
            setUserEducation(prevState => prevState.filter((item, index) => item !== education));
            const setAuth = {
                userdata: updateEducationRes.data.user,
                token: updateEducationRes.data.token
            };
            createAuthSession(setAuth);
            setAlertBox({ alert: 'success', message: updateEducationRes.message });

            setTimeout(() => {
                setAlertBox({ alert: '', message: '' });
            }, 5000);
        } else {
            setAlertBox({ alert: 'danger', message: updateEducationRes.message });
            setTimeout(() => {
                setAlertBox({ alert: '', message: '' });
            }, 5000);
        }
    };

    useEffect(() => {
        fetchEducationData();
    }, []);

    return (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title">Education</h3>
            </div>

            <div className='m-1'>
                <AlertBox alert={alertBox.alert} message={alertBox.message} />
            </div>

            <form id='updateProfile' className="form-horizontal" onSubmit={addNewEducation}>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-12'>
                            {userEducation.length > 0 ? <>
                                <dl>
                                    {userEducation.map((edu, i) => {
                                        return <React.Fragment key={i}>
                                            <UserEducationUpdateView 
                                            authFlag={authFlag} 
                                            authToken={authToken} 
                                            authUser={authUser} 
                                            userEducation={userEducation} 
                                            education={edu} 
                                            deleteEducation={deleteEducation} />
                                            <hr />
                                        </React.Fragment>
                                    })}
                                </dl>
                            </> : <>
                                <p>Add education to show here.</p>
                            </>}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-12 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">School/College/University</label>
                                    <input type="text" className="form-control" name="school_college_university" value={userEducationFormData.school_college_university} onChange={userFormEducationHandleChange} placeholder="Highest education qualification" />
                                    {userEducationFormErrors.school_college_university && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.school_college_university}</span> : <></>}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-4 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">Degree/Certificate</label>
                                    <input type="text"
                                        className="form-control"
                                        name="degree"
                                        value={userEducationFormData.degree}
                                        onChange={userFormEducationHandleChange}
                                        placeholder="Degree" />
                                    {userEducationFormErrors.degree && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.degree}</span> : <></>}
                                </div>

                                <div className='col-md-4 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">Start year</label>
                                    <input type="date"
                                        className="form-control"
                                        name="start_date"
                                        value={userEducationFormData.start_date}
                                        onChange={userFormEducationHandleChange}
                                        placeholder="Start year"
                                        max={getCurrentDate()} />
                                    {userEducationFormErrors.start_date && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.start_date}</span> : <></>}
                                </div>

                                <div className='col-md-4 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">End Year</label>
                                    <input type="date"
                                        className="form-control"
                                        name="end_date"
                                        value={userEducationFormData.end_date}
                                        onChange={userFormEducationHandleChange}
                                        placeholder="End year"
                                        min={userEducationFormData.start_date}
                                        max={getCurrentDate()}
                                        disabled={!userEducationFormData.start_date} />
                                    {userEducationFormErrors.end_date && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.end_date}</span> : <></>}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12 form-group'>
                                    <label htmlFor="inputdescription" className="col-form-label">Details</label>
                                    <textarea type="text" className="form-control" name="description" value={userEducationFormData.description} onChange={userFormEducationHandleChange} placeholder="Description"></textarea>
                                    {userEducationFormErrors.description && userEducationFormData.submited ? <span className="text-danger">{userEducationFormErrors.description}</span> : <></>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button type="submit" className="btn btn-info float-right">
                        {userFormLoader ? <>
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </> : <>
                            Add Education
                        </>}
                    </button>
                </div>

            </form>
        </div>
    );
}