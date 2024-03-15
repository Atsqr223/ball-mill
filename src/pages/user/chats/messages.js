import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

import styles from './Message.css';

// import wavFile from '../../audio/wavFile.wav';
import useSound from 'use-sound';
import Swal from 'sweetalert2';

// socket
import { socket } from '../../../utils/socket';

// component
export default function Messages(props) {
    // page title
    document.title = "Subha welcomes you | Message";

    const { authFlag, authToken, authUser } = useOutletContext();

    const navigate = useNavigate();

    const messageEl = useRef(null);
    // const [playSound] = useSound(wavFile);

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        senderID: '',
        receiverID: '',
        message: '',
        time: new Date()
    });
    const [messageData, setMessageData] = useState([]);
    const [messageType, setMessageType] = useState('');
    const [sendToDetails, setsendToDetails] = useState({});
    const [allUser, setAllUser] = useState([]);
    const [messageLoader, setMessageLoader] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    let typing = false;
    let timeout = undefined;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        setFormData((prevFormData) => ({ ...prevFormData, name: authUser.name }));
        setFormData((prevFormData) => ({ ...prevFormData, senderID: authUser._id }));
        setFormData((prevFormData) => ({ ...prevFormData, receiverID: sendToDetails._id }));

        // message typing
        if (typing == false) {
            typing = true;
            console.log("sendToDetails :: ", sendToDetails);
            socket.emit("userTyping", { sendFrom: authUser, sendTo: sendToDetails, message: `${authUser.name} is typing...` });
            timeout = setTimeout(timeoutFunction, 2000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 2000);
        }
    };

    function timeoutFunction() {
        typing = false;
        socket.emit("userTyping", { sendFrom: authUser, sendTo: sendToDetails, message: '' });
    }

    const validateForm = (data) => {
        if (!data.message.trim()) {
            return false;
        } else {
            return true;
        }
    };

    const sendMessage = (event, re) => {
        event.preventDefault();
        if (validateForm(formData)) {
            const today = new Date();
            setFormData((prevFormData) => ({ ...prevFormData, time: new Date(today.toGMTString()) }));
            socket.emit("sendMessage", formData);
            setFormData((prevFormData) => ({ ...prevFormData, message: '' }));
            setMessageData(prevFormData => [...prevFormData, formData]);
        }
    }

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
        setsendToDetails({ ...receiver });
        // console.log("sendToDetails :: ", sendToDetails.name);
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

        socket.on("userTyping", (data) => {
            console.log("sendToDetails HELLO:: ", sendToDetails);
            if (Object.keys(sendToDetails).length !== 0) {
                // console.log("sendToDetails._id :: ", sendToDetails.name);
                // console.log("data.sendFrom._id :: ", data.sendFrom._id);
                if (sendToDetails._id === data.sendFrom._id) {
                    // console.log("OKKKKKKKKKKK");
                    setMessageType(data.message);
                }
            }
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

        // scroll
        if (messageEl && !messageLoader) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
        console.log("USEEFFECT :: sendToDetails :: ", sendToDetails.name);
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
                        <div className="card card-primary">
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
                        </div>

                        {messageLoader ? <div className="col-md-8" style={{ height: '100vh' }}>
                            <div className="card direct-chat direct-chat-warning">
                                <div className="card-header">
                                    <h3 className="card-title">Loading messages <b className="font-weight-bold">{sendToDetails.name}</b></h3>
                                </div>
                                <div className="card-body">
                                    <div className="direct-chat-messages"></div>
                                </div>
                                <div className="overlay">
                                    <i className="fas fa-3x fa-sync-alt"></i>
                                </div>
                            </div>
                        </div>
                            :
                            <div className="col-md-8">
                                <div className="card direct-chat direct-chat-warning">
                                    <div className="card-header">
                                        <h3 className="card-title">Chat with <b className="font-weight-bold">{sendToDetails.name}</b></h3>

                                        {/* <div className="card-tools">
                                        <span title="3 New Messages" className="badge badge-warning">3</span>
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" title="Contacts" data-widget="chat-pane-toggle">
                                            <i className="fas fa-comments"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div> */}
                                    </div>
                                    <div className="card-body">
                                        <div className="direct-chat-messages" ref={messageEl}>
                                            {messageData.map((data, i) => {
                                                return <div key={i}>
                                                    {
                                                        (authUser._id.toString() === data.receiverID?._id || authUser._id.toString() === data.receiverID) ?
                                                            (<div className="direct-chat-msg">
                                                                <div className="direct-chat-infos clearfix">
                                                                    <span className="direct-chat-name float-left">{sendToDetails.name}</span>
                                                                    <span className="direct-chat-timestamp float-right">{formatDate(data.time)}</span>
                                                                </div>
                                                                <img className="direct-chat-img" src="assets/dist/img/user1-128x128.jpg" alt="message user image" />
                                                                <div className="direct-chat-text">
                                                                    {data.message}
                                                                </div>
                                                            </div>) : (
                                                                <div className="direct-chat-msg right">
                                                                    <div className="direct-chat-infos clearfix">
                                                                        <span className="direct-chat-name float-right">{authUser.name}</span>
                                                                        <span className="direct-chat-timestamp float-left">{formatDate(data.time)}</span>
                                                                    </div>
                                                                    <img className="direct-chat-img" src="assets/dist/img/user3-128x128.jpg" alt="message user image" />
                                                                    <div className="direct-chat-text">
                                                                        {data.message}
                                                                    </div>
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            })}

                                        </div>

                                        <p>{messageType}</p>
                                    </div>

                                    {sendToDetails ?
                                        <div className="card-footer">
                                            <form onSubmit={sendMessage}>
                                                <div className="input-group">
                                                    <input type="text" name="message" placeholder="Type Message ..." autoComplete='off' className="form-control" value={formData.message} onChange={handleChange} />
                                                    <span className="input-group-append">
                                                        <button type="submit" className="btn btn-warning">Send</button>
                                                    </span>
                                                </div>
                                            </form>
                                        </div> : <></>}
                                </div>
                            </div>
                        }
                    </div>
                </section>
            </div>
        </>
    );
}