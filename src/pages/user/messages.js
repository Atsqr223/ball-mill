import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

import moment from "moment";

import wavFile from '../../audio/wavFile.wav';
import useSound from 'use-sound';
import Swal from 'sweetalert2';

// socket
import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_API_BASE_URL);

// component
export default function Messages(props) {

    // page title
    document.title = "Welcome to We connect | " + props.title;

    const navigate = useNavigate();

    const messageEl = useRef(null);
    const [playSound] = useSound(wavFile);

    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        senderID: '',
        receiverID: '',
        message: '',
        time: new Date()
    });
    const [messageData, setMessageData] = useState([]);
    const [messageType, setMessageType] = useState('');
    const [loginUserData, setLoginUserData] = useState(JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY)));
    const [receiverDetails, setReceiverDetails] = useState('');
    const [allUser, setAllUser] = useState([]);
    const [messageLoader, setMessageLoader] = useState(false);

    let typing = false;
    let timeout = undefined;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

        let userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY));
        setFormData((prevFormData) => ({ ...prevFormData, name: userData.userdata.name }));
        setFormData((prevFormData) => ({ ...prevFormData, senderID: userData.userdata._id }));
        setFormData((prevFormData) => ({ ...prevFormData, receiverID: receiverDetails._id }));

        // message typing
        if (typing == false) {
            typing = true;
            socket.emit("type_message", userData.userdata.name + " is typing...");
            timeout = setTimeout(timeoutFunction, 3000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 3000);
        }
    };

    const validateForm = (data) => {
        if (!data.message.trim()) {
            return false;
        } else {
            return true;
        }
    };

    function timeoutFunction() {
        typing = false;
        socket.emit("type_message", "");
    }

    const sendMessage = (event, re) => {
        event.preventDefault();
        if (validateForm(formData)) {
            const today = new Date();
            setFormData((prevFormData) => ({ ...prevFormData, time: new Date(today.toGMTString()) }));
            socket.emit("send_message", formData);
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

    const fetchMessage = async (senderID, receiver) => {
        setMessageLoader(true);
        setReceiverDetails(receiver);
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + `api/v1/message/getall?senderID=${senderID}&receiverID=${receiver._id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': loginUserData.token
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
        let param = `?limit=20`;
        param += `&skip=0`;
        param += `&condition=`;
        param += `&sort_field=_id`;
        param += `&sort_order=desc`;
        param += `&page_no=1`;
        param += `&search_keyword=`;
        param += `&id=${loginUserData.userdata._id}`;
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + `api/v1/user/list${param}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': loginUserData.token
            }
        });
        const data = await response.json();

        setAllUser(data.data.users);
    };

    useEffect(() => {
        fetchUserList();
        // fetchMessage();

        socket.emit("addUser", loginUserData.userdata._id);
        socket.on("getUsers", (data) => {
            console.log("USERS :: ", data);
        });

        socket.on("someone_type_message", (data) => {
            setMessageType(data);
        });

        socket.on("receive_message", (data) => {
            console.log("data :: ", data);
            console.log(`${data.receiverID} === ${loginUserData.userdata._id}`);
            console.log(`${data.senderID} === ${receiverDetails._id}`);
            console.log(`receiverDetails :: `, receiverDetails);
            if (data.receiverID == loginUserData.userdata._id && data.senderID == receiverDetails._id) {
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
    }, [socket, receiverDetails]);

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
                        {loader ? <div className="col-md-4 overflow-auto" style={{ height: '100vh' }}>
                            <div className="card direct-chat direct-chat-warning">
                                <div className="card-header">
                                    <h3 className="card-title">Loading messages <b className="font-weight-bold">{receiverDetails.name}</b></h3>
                                </div>
                                <div className="card-body">
                                    <div className="direct-chat-messages"></div>
                                </div>
                                <div className="overlay">
                                    <i className="fas fa-3x fa-sync-alt"></i>
                                </div>
                            </div>
                        </div> :
                            <div className='col-md-4 overflow-auto' style={{ height: '100vh' }}>
                                {allUser.map((user, i) => {
                                    return <div className="info-box" style={{ cursor: 'pointer' }} key={i} onClick={() => fetchMessage(loginUserData.userdata._id, user)}>
                                        <span className="info-box-icon bg-info"><i className="far fa-user"></i></span>
                                        <div className="info-box-content">
                                            <h5 className="widget-user-username">{user.name}</h5>
                                            <h6 className="info-box-number">{user.email}</h6>
                                        </div>
                                    </div>;
                                })}
                            </div>
                        }

                        {messageLoader ? <div className="col-md-8" style={{ height: '100vh' }}>
                            <div className="card direct-chat direct-chat-warning">
                                <div className="card-header">
                                    <h3 className="card-title">Loading messages <b className="font-weight-bold">{receiverDetails.name}</b></h3>
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
                                        <h3 className="card-title">Chat with <b className="font-weight-bold">{receiverDetails.name}</b></h3>

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
                                                        (loginUserData.userdata._id.toString() === data.receiverID?._id || loginUserData.userdata._id.toString() === data.receiverID) ?
                                                            (<div className="direct-chat-msg">
                                                                <div className="direct-chat-infos clearfix">
                                                                    <span className="direct-chat-name float-left">{receiverDetails.name}</span>
                                                                    <span className="direct-chat-timestamp float-right">{formatDate(data.time)}</span>
                                                                </div>
                                                                <img className="direct-chat-img" src="assets/dist/img/user1-128x128.jpg" alt="message user image" />
                                                                <div className="direct-chat-text">
                                                                    {data.message}
                                                                </div>
                                                            </div>) : (
                                                                <div className="direct-chat-msg right">
                                                                    <div className="direct-chat-infos clearfix">
                                                                        <span className="direct-chat-name float-right">{loginUserData.userdata.name}</span>
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

                                    {receiverDetails ?
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