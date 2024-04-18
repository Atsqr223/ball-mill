import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import { createAuthSession } from "../../../utils/authHelper";

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
        bio: '',
        submited: false
    });
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

        if(name == 'start_date') {
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
            setUserEducation(prevState => ([
                ...prevState,
                {
                    school_college_university: userEducationFormData.school_college_university,
                    degree: userEducationFormData.degree,
                    start_date: userEducationFormData.start_date,
                    end_date: userEducationFormData.end_date,
                    bio: userEducationFormData.bio,
                }
            ]));

            const newState = {};
            for (const key in userEducationFormData) {
                newState[key] = '';
            }
            setUserEducationFormData(newState);
        }
    };

    const deleteEducation = (indexToRemove) => {
        Swal.fire({
            title: `Do you want to delete ${userEducation[indexToRemove].school_college_university} ?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                setUserEducation(prevState => prevState.filter((item, index) => index !== indexToRemove));
            } else {
                console.log('Logout cancel.');
            }
        });
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

    const submitUserEducation = () => {

    }

    useEffect(() => {
        console.log("userEducation :: ", userEducation)
    }, [userEducation]);

    return (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title">Education</h3>
            </div>

            <div className='m-1'>
                <AlertBox alert={alertBox.alert} message={alertBox.message} />
            </div>

            <form id='updateProfile' className="form-horizontal" onSubmit={submitUserEducation}>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-12'>
                            {userEducation.length > 0 ? <>
                                {userEducation.map((edu, i) => {
                                    return <React.Fragment key={i}>
                                        <div className='row'>
                                            <div className='col-md-12 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">School/College/University</label>
                                                <input type="text" className="form-control" value={edu.school_college_university} disabled />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-4 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">Degree/Certificate</label>
                                                <input type="text" className="form-control" value={edu.degree} disabled />
                                            </div>

                                            <div className='col-md-4 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">Start year</label>
                                                <input type="date" className="form-control" value={edu.start_date} disabled />
                                            </div>

                                            <div className='col-md-4 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">End Year</label>
                                                <input type="date" className="form-control" value={edu.end_date} disabled />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-12 form-group'>
                                                <label htmlFor="inputBio" className="col-form-label">Details</label>
                                                <textarea type="text" className="form-control" value={edu.bio} disabled></textarea>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <button type="button" className="btn btn-danger float-right" onClick={() => deleteEducation(i)}>
                                                    Delete Education
                                                </button>
                                            </div>
                                        </div>

                                        <hr />
                                    </React.Fragment>
                                })}
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