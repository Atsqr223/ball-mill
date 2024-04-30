import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

import AlertBox from "../common/AlertBox";
import { createAuthSession } from "../../utils/authHelper";

// component
export default function UserEducationUpdateView(props) {
    // page title
    const { authFlag, authToken, authUser, education } = props;
    const navigate = useNavigate();

    // user form update start
    const [deleteEducationLoader, setDeleteEducationLoader] = useState(false);
    const [alertBox, setAlertBox] = useState({
        alert: '',
        message: ''
    });

    const deleteEducation = () => {
        Swal.fire({
            title: `Do you want to delete ${education.school_college_university} ?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                setDeleteEducationLoader(true);
                fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/profile/delete-education/${education._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({})
                }).then((response) => response.json()).then((updateEducationRes) => {
                    setDeleteEducationLoader(false);
                    props.deleteEducation(education, updateEducationRes);
                });
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

    const getDate = (paramDate) => {
        const date = new Date(paramDate);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Add leading zero if month/day is single digit
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        
    }, []);

    return (
        <>
            <React.Fragment>
                <dt>{education.degree}</dt>
                <dd>from <span className='font-weight-bold'>{education.school_college_university}</span> on&nbsp;
                    <span className='font-weight-bold'>{getDate(education.start_date)}</span> to <span className='font-weight-bold'>{getDate(education.end_date)}.</span>
                    <button type="button" className="btn btn-danger btn-sm float-right" onClick={() => deleteEducation(education)} disabled={deleteEducationLoader}>
                        {deleteEducationLoader ? <>
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </> : <>
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </>}
                    </button>
                </dd>
            </React.Fragment>
        </>
    );
}