import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";
import Swal from 'sweetalert2';

// component
import AlertBox from "../../components/common/AlertBox";

// helper
import { utcToLocalTime, timeAgo } from "../../utils/timeHelper";

// component
export default function OnlineUsersComponent(props) {
    const { authFlag, authToken, authUser } = props;
    const { loader, onlineUsers, sendToDetails, setSendToDetails, fetchUserList, fetchMessage } = props;

    useEffect(() => {
        // console.log("HELLO sendToDetails :: ", sendToDetails);
        fetchUserList();
    }, [sendToDetails]);

    return (<div className="card card-primary">
        <div className="card-header">
            <h3 className="card-title">Friends</h3>
            <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="card-refresh" onClick={fetchUserList}>
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>

        </div>

        {loader ? <div className="card-body">
            <p>Getting...</p>
        </div> : <div className="card-body">
            {onlineUsers.map((user, i) => {
                return <React.Fragment key={i}>
                    {user.userData._id !== authUser._id ? <>
                        <div className="info-box" style={{ cursor: 'pointer' }} key={i} onClick={(e) => fetchMessage(authUser, user.userData)}>
                            <span className="info-box-icon bg-info"><i className="far fa-user"></i></span>
                            <div className="info-box-content">
                                <h5 className="widget-user-username">{user.userData.name}</h5>
                                <h6 className="info-box-number">{user.userData.email}</h6>
                            </div>
                        </div>
                    </> : <></>}
                </React.Fragment>;
            })}
        </div>}
    </div>);
}