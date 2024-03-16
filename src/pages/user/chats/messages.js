import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// import wavFile from '../../audio/wavFile.wav';
import useSound from 'use-sound';
import Swal from 'sweetalert2';

// socket
import { socket } from '../../../utils/socket';
import OnlineUsersComponent from '../../../components/message/OnlineUsersComponent';
import MessageBoxComponent from '../../../components/message/MessageBoxComponent';

// component
export default function Messages(props) {
    // page title
    document.title = "Subha welcomes you | Message";

    const { authFlag, authToken, authUser } = useOutletContext();

    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);

    const [messageData, setMessageData] = useState([]);
    const [messageType, setMessageType] = useState('');
    const [sendToDetails, setSendToDetails] = useState({});
    const [allUser, setAllUser] = useState([]);
    const [messageLoader, setMessageLoader] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const formatDate = (gmtDate) => {
        const gmtdateObj = new Date(gmtDate);
        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const convertedTime = gmtdateObj.toLocaleString("en-US", {
            timeZone: localTimeZone
        });

        return convertedTime.toLocaleString();
    }

    const fetchMessage = async (sender, receiver) => {
        setMessageLoader(true);
        setSendToDetails({ ...receiver });
        console.log("sendToDetails :: ", sendToDetails.name);
        // console.log("receiver :: ", receiver.name);
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + `api/v1/message/getall?senderID=${sender._id}&receiverID=${receiver._id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        }).then((response) => response.json()).then((messageRes) => {
            if (messageRes.success === true) {
                setMessageData(messageRes.data.messages);
            } else {
                setMessageData([]);
            }
            setMessageLoader(false);
        });
    };

    const fetchUserList = async () => {
        return;
        setLoader(true);
        let param = `?limit=20`;
        param += `&skip=0`;
        param += `&condition=`;
        param += `&sort_field=_id`;
        param += `&sort_order=desc`;
        param += `&page_no=1`;
        param += `&search_keyword=`;
        param += `&id=${authUser._id}`;
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + `api/v1/user/list${param}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        }).then((response) => response.json()).then((userRes) => {
            if (userRes.success === true) {
                setAllUser(userRes.data.users);
            } else {
                setAllUser([]);
            }
            setLoader(false);
        });
    };

    function isUnique(obj, index, self) {
        return index === self.findIndex(o => (
            o.socketId === obj.socketId
        ));
    }

    useEffect(() => {
        socket.emit("newUserOnline", authUser);
        socket.on("getOnlineUsers", (users) => {
            let allUser = onlineUsers.concat(users)
            const uniqueArray = allUser.filter(isUnique);
            setOnlineUsers([...uniqueArray]);
        });

        socket.on("receiveMessage", (data) => {
            console.log("data :: ", data);
            console.log(`${data.receiverID} === ${authUser._id}`);
            console.log(`${data.senderID} === ${sendToDetails._id}`);
            console.log(`sendToDetails :: `, sendToDetails);
            if (data.receiverID == authUser._id && data.senderID == sendToDetails._id) {
                setMessageData(prevFormData => [...prevFormData, data]);
            } else {
                // console.log("ERROR");
                // Swal.fire({
                //     position: "top-end",
                //     icon: "success",
                //     title: "Received new message.",
                //     showConfirmButton: false,
                //     timer: 1500
                // });
            }
        });
    }, [socket, sendToDetails]);

    return (
        <>
            {/* <!-- Content Header (Page header) --> */}
            <div className="content-header">
                <div className="container">
                    {/* <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0"> Top Navigation <small>Example 3.0</small></h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Layout</a></li>
                                <li className="breadcrumb-item active">Top Navigation</li>
                            </ol>
                        </div>
                    </div> */}
                </div>
            </div>
            {/* <!-- /.content-header --> */}

            {/* <!-- Main content --> */}
            <div className="content" style={{ marginTop: "40px", marginBottom: '52px' }}>
                <section className="container">
                    <div className="row">
                        <OnlineUsersComponent
                            authFlag={authFlag}
                            authToken={authToken}
                            authUser={authUser}
                            onlineUsers={onlineUsers}
                            fetchUserList={fetchUserList}
                            setSendToDetails={setSendToDetails}
                            sendToDetails={sendToDetails}
                            fetchMessage={fetchMessage}
                            loader={loader}
                        />

                        <MessageBoxComponent
                            socket={socket}
                            authFlag={authFlag}
                            authToken={authToken}
                            authUser={authUser}
                            messageLoader={messageLoader}
                            sendToDetails={sendToDetails}
                            messageData={messageData}
                            setMessageData={setMessageData}
                            messageType={messageType}
                            setMessageType={setMessageType}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}