import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function FollowUnfollowButton(props) {
    const { authFlag, authToken, authUser } = useOutletContext();
    const navigate = useNavigate();
    const [followLoader, setFollowLoader] = useState(false);
    const [isFollow, setIsFollow] = useState(props.isFollow);
    // user form update end

    const followUnfollow = async (userId) => {
        setFollowLoader(true);
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/friends/follow-unfollow/${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            }).then((response) => response.json()).then((followRes) => {
                if (followRes.success === true) {
                    setIsFollow(followRes.data.youAreFollowing);
                }
            });
        } catch (error) {
            console.log("ERROR");
        } finally {
            setFollowLoader(false);
            console.log("FINAL");
        }
    };

    useEffect(() => {
    }, []);

    return (
        <>
            {isFollow ? <>
                <Link className="btn btn-danger btn-block" onClick={() => followUnfollow(props.userData._id)} disable="followLoader">
                    {followLoader ? <>
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </> : <>
                        <b>Unfollow</b>
                    </>}
                </Link>
            </> : <>
                <Link className="btn btn-primary btn-block" onClick={() => followUnfollow(props.userData._id)} disable="followLoader">
                    {followLoader ? <>
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </> : <>
                        <b>Follow</b>
                    </>}
                </Link>
            </>}
        </>
    );
}