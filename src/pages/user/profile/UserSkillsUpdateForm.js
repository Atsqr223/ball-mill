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
    const [skillLoader, setSkillLoader] = useState(false);
    const [addSkillLoader, setAddSkillLoader] = useState(false);
    const [deleteSkillLoader, setDeleteSkillLoader] = useState(false);
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
    const addNewSkills = async (event) => {
        event.preventDefault();
        setUserSkillsFormData((prevFormData) => ({ ...prevFormData, submited: true }));
        const validationErrors = validateuserSkillsForm(userSkillsFormData);
        setUserSkillsFormErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setAddSkillLoader(true);
            await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/profile/create-skill', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(userSkillsFormData)
            }).then((response) => response.json()).then((updateSkilsRes) => {
                setUserSkillsFormData((prevFormData) => ({ ...prevFormData, submited: false }));
                setAddSkillLoader(false);
                if (updateSkilsRes.success === true) {
                    setUserSkills(prevState => ([
                        ...prevState,
                        updateSkilsRes.data.new_skill
                    ]));

                    const newState = {};
                    for (const key in userSkillsFormData) {
                        newState[key] = '';
                    }
                    setUserSkillsFormData(newState);

                    const setAuth = {
                        userdata: updateSkilsRes.data.user,
                        token: updateSkilsRes.data.token
                    };
                    createAuthSession(setAuth);

                    setAlertBox({ alert: 'success', message: updateSkilsRes.message });
                    setTimeout(() => {
                        setAlertBox({ alert: '', message: '' });
                    }, 5000);
                } else {
                    setAlertBox({ alert: 'danger', message: updateSkilsRes.message });
                    setTimeout(() => {
                        setAlertBox({ alert: '', message: '' });
                    }, 5000);
                }
            });
        } else {
            setAddSkillLoader(false);
        }
    };

    const deleteSkill = (indexToRemove) => {
        Swal.fire({
            title: `Do you want to delete ${userSkills[indexToRemove].name} ?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                setDeleteSkillLoader(true);
                fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/profile/delete-skill/${userSkills[indexToRemove]._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({})
                }).then((response) => response.json()).then((updateSkillsRes) => {
                    setDeleteSkillLoader(false);
                    if (updateSkillsRes.success === true) {
                        setUserSkills(prevState => prevState.filter((item, index) => index !== indexToRemove));

                        const setAuth = {
                            userdata: updateSkillsRes.data.user,
                            token: updateSkillsRes.data.token
                        };
                        createAuthSession(setAuth);
                        setAlertBox({ alert: 'success', message: updateSkillsRes.message });

                        setTimeout(() => {
                            setAlertBox({ alert: '', message: '' });
                        }, 5000);
                    } else {
                        setAlertBox({ alert: 'danger', message: updateSkillsRes.message });
                        setTimeout(() => {
                            setAlertBox({ alert: '', message: '' });
                        }, 5000);
                    }
                });
            } else {
                console.log('Logout cancel.');
            }
        });
    };

    // fetch data
    const fetchSkillData = async () => {
        setSkillLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/profile/get-skill`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((skillsRes) => {
                setSkillLoader(false);
                if (skillsRes.success === true) {
                    setUserSkills(prevItems => [...prevItems, ...skillsRes.data.skills]);
                } else {
                    setUserSkills([]);
                }
            });
        } catch (error) {
            setSkillLoader(false);
            setAlertBox({ alert: 'danger', message: 'An error occord.' });
        } finally {
            setSkillLoader(false);
        }
    };

    useEffect(() => {
        if (userSkills.length === 0) {
            fetchSkillData();
        }
    }, []);

    return (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title">Skills</h3>
            </div>

            <div className='m-1'>
                <AlertBox alert={alertBox.alert} message={alertBox.message} />
            </div>

            <form id='updateProfile' className="form-horizontal" onSubmit={addNewSkills}>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-12'>
                            {userSkills.length > 0 ? <>
                                <dl>
                                    {userSkills.map((skill, i) => {
                                        return <React.Fragment key={i}>
                                            <dt>{skill.name}</dt>
                                            <dd>I have <span className='font-weight-bold'>{`${skill.year_of_experience} year`}</span> of experience in
                                                <span className='font-weight-bold'>{` ${skill.name}.`}</span>
                                                <button type="button" className="btn btn-danger btn-sm float-right" onClick={() => deleteSkill(i)} disabled={deleteSkillLoader}>
                                                    {deleteSkillLoader ? <>
                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </> : <>
                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                    </>}
                                                </button>
                                            </dd>
                                            <hr />
                                        </React.Fragment>
                                    })}
                                </dl>
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
                                    <label htmlFor="inputEducation" className="col-form-label">Year of experience</label>
                                    <input type="number"
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
                                    <textarea type="text" className="form-control" name="description" value={userSkillsFormData.description} onChange={userSkillHandleChange} placeholder="Description"></textarea>
                                    {userSkillsFormErrors.description && userSkillsFormData.submited ? <span className="text-danger">{userSkillsFormErrors.description}</span> : <></>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button type="submit" className="btn btn-info float-right">
                        {addSkillLoader ? <>
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </> : <>
                            Add Skill
                        </>}
                    </button>
                </div>

            </form>
        </div>
    );
}