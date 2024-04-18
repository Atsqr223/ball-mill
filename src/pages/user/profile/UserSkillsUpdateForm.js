import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import './profile.css';

import AlertBox from "../../../components/AlertBox";
import { createAuthSession } from "../../../utils/authHelper";

// component
export default function UserSkillsUpdateForm(props) {
    // page title
    const { authFlag, authToken, authUser } = props;
    const navigate = useNavigate();

    // user form update start
    const [userFormLoader, setUserFormLoader] = useState(false);
    const [userSkillsFormData, setUserSkillsFormData] = useState({
        name: '',
        year_of_experience: '',
        description: '',
        submited: false
    });
    const [userSkills, setUserSkills] = useState([]);
    const [userSkillsFormErrors, setUserSkillsFormErrors] = useState({});
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });
    const userSkillHandleChange = (event) => {
        const { name, value } = event.target;
        setUserSkillsFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        const validationErrors = validateuserSkillsForm(userSkillsFormData);
        setUserSkillsFormErrors(validationErrors);
    };
    const validateuserSkillsForm = (data) => {
        let errors = {};

        // Validation rules
        if (!data.name.trim()) {
            errors.name = 'Name is required.';
        }

        if (!data.year_of_experience.trim()) {
            errors.year_of_experience = 'Year of experience is required.';
        }

        if (!data.description.trim()) {
            errors.description = 'Description is required.';
        }

        return errors;
    };
    const addNewSkills = () => {
        setUserSkillsFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = validateuserSkillsForm(userSkillsFormData);
        setUserSkillsFormErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setUserSkills(prevState => ([
                ...prevState,
                {
                    name: userSkillsFormData.name,
                    year_of_experience: userSkillsFormData.year_of_experience,
                    description: userSkillsFormData.description
                }
            ]));

            const newState = {};
            for (const key in userSkillsFormData) {
                newState[key] = '';
            }
            setUserSkillsFormData(newState);
        }
    };

    const deleteSkill = (indexToRemove) => {
        Swal.fire({
            title: `Do you want to delete ${userSkills[indexToRemove].school_college_university} ?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                setUserSkills(prevState => prevState.filter((item, index) => index !== indexToRemove));
            } else {
                console.log('Logout cancel.');
            }
        });
    };

    const submitUserSkills = () => {

    }

    useEffect(() => {
        console.log("userSkills :: ", userSkills)
    }, [userSkills]);

    return (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title">Skills</h3>
            </div>

            <div className='m-1'>
                <AlertBox alert={alertBox.alert} message={alertBox.message} />
            </div>

            <form id='updateProfile' className="form-horizontal" onSubmit={submitUserSkills}>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-12'>
                            {userSkills.length > 0 ? <>
                                {userSkills.map((skill, i) => {
                                    return <React.Fragment key={i}>
                                        <div className='row'>
                                            <div className='col-md-9 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">Name</label>
                                                <input type="text" className="form-control" value={skill.name} disabled />
                                            </div>

                                            <div className='col-md-3 form-group'>
                                                <label htmlFor="inputEducation" className="col-form-label">Year of experience</label>
                                                <input type="text" className="form-control" value={skill.year_of_experience} disabled />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-12 form-group'>
                                                <label htmlFor="inputBio" className="col-form-label">Description</label>
                                                <textarea type="text" className="form-control" value={skill.description} disabled></textarea>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <button type="button" className="btn btn-danger float-right" onClick={() => deleteSkill(i)}>
                                                    Delete Skill
                                                </button>
                                            </div>
                                        </div>

                                        <hr />
                                    </React.Fragment>
                                })}
                            </> : <>
                                <p>Add skills to show here.</p>
                            </>}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-9 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">Name</label>
                                    <input type="text" className="form-control" name="name" value={userSkillsFormData.name} onChange={userSkillHandleChange} placeholder="Skill name" />
                                    {userSkillsFormErrors.school_college_university && userSkillsFormData.submited ? <span className="text-danger">{userSkillsFormErrors.name}</span> : <></>}
                                </div>

                                <div className='col-md-3 form-group'>
                                    <label htmlFor="inputEducation" className="col-form-label">Degree/Certificate</label>
                                    <input type="text"
                                        className="form-control"
                                        name="year_of_experience"
                                        value={userSkillsFormData.year_of_experience}
                                        onChange={userSkillHandleChange}
                                        placeholder="Year of experience" />
                                    {userSkillsFormErrors.year_of_experience && userSkillsFormData.submited ? <span className="text-danger">{userSkillsFormErrors.year_of_experience}</span> : <></>}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12 form-group'>
                                    <label htmlFor="inputBio" className="col-form-label">Description</label>
                                    <textarea type="text" className="form-control" name="description" value={userSkillsFormData.description} onChange={userSkillHandleChange} placeholder="Bio"></textarea>
                                    {userSkillsFormErrors.description && userSkillsFormData.submited ? <span className="text-danger">{userSkillsFormErrors.description}</span> : <></>}
                                </div>
                            </div>

                            <button type="button" className="btn btn-info float-right" onClick={addNewSkills}>
                                Add Skill
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