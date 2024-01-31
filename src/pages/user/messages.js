import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

import moment from "moment";

import wavFile from '../../audio/wavFile.wav';
import useSound from 'use-sound';

// socket
import io from "socket.io-client";
const socket = io.connect("https://we-connect-backend.onrender.com");

// component
export default function Messages(props) {

    // page title
    document.title = "Welcome to We connect | " + props.title;

    const navigate = useNavigate();

    const messageEl = useRef(null);
    const [playSound] = useSound(wavFile);

    const [formData, setFormData] = useState({ senderID: '', name: '', message: '', time: new Date() });
    const [messageData, setMessageData] = useState([]);
    const [messageType, setMessageType] = useState('');
    const [loginUserData, setLoginUserData] = useState(JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY)));

    let typing = false;
    let timeout = undefined;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

        let userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY));
        setFormData((prevFormData) => ({ ...prevFormData, name: userData.name }));
        setFormData((prevFormData) => ({ ...prevFormData, senderID: userData._id }));

        // message typing
        if (typing == false) {
            typing = true;
            socket.emit("type_message", userData.name + " is typing...");
            timeout = setTimeout(timeoutFunction, 3000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 3000);
        }
    };

    function timeoutFunction() {
        typing = false;
        socket.emit("type_message", "");
    }

    const sendMessage = (event) => {
        event.preventDefault();
        const today = new Date();

        setFormData((prevFormData) => ({ ...prevFormData, time: new Date(today.toGMTString()) }));
        socket.emit("send_message", formData);
        setFormData((prevFormData) => ({ ...prevFormData, message: '' }));
        setMessageData(prevFormData => [...prevFormData, formData]);
    }

    const formatDate = (gmtDate) => {
        const gmtdateObj = new Date(gmtDate);
        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const convertedTime = gmtdateObj.toLocaleString("en-US", {
            timeZone: localTimeZone
        });

        return convertedTime.toLocaleString();
    }

    const fetchMessage = async () => {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/v1/message/getall');
        const data = await response.json();

        setMessageData(data.data.messages);
    };

    useEffect(() => {
        fetchMessage();

        socket.on("someone_type_message", (data) => {
            setMessageType(data);
        });

        socket.on("receive_message", (data) => {
            // const audio = new Audio(wavFile);
            // audio.play();
            setMessageData(prevFormData => [...prevFormData, data]);
        });

        // scroll
        if (messageEl) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [socket]);

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
                        <div className='col-md-3 d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block overflow-auto' style={{ height: '100vh' }}>
                            <div className="card card-widget widget-user-2 shadow-sm">
                                {/* <!-- Add the bg color to the header using any of the bg-* classes --> */}
                                <div className="widget-user-header bg-warning">
                                    <div className="widget-user-image">
                                        <img className="img-circle elevation-2" src="/assets/dist/img/user7-128x128.jpg" alt="User Avatar" />
                                    </div>
                                    <h3 className="widget-user-username">{loginUserData.name}</h3>
                                    <h5 className="widget-user-desc">Lead Developer</h5>
                                </div>
                                <div className="card-footer p-0">
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Friend's <span className="float-right badge bg-primary">31</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Followers <span className="float-right badge bg-info">5</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Following <span className="float-right badge bg-success">12</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Subscribe <span className="float-right badge bg-danger">842</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                Likes <span className="float-right badge bg-danger">842</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card direct-chat direct-chat-warning">
                                <div className="card-header">
                                    <h3 className="card-title">Direct Chat {loginUserData.email}</h3>

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
                                                    (loginUserData._id != data.senderID) ?
                                                        (<div className="direct-chat-msg">
                                                            <div className="direct-chat-infos clearfix">
                                                                <span className="direct-chat-name float-left">{data.name}</span>
                                                                <span className="direct-chat-timestamp float-right">{formatDate(data.time)}</span>
                                                            </div>
                                                            <img className="direct-chat-img" src="assets/dist/img/user1-128x128.jpg" alt="message user image" />
                                                            <div className="direct-chat-text">
                                                                {data.message}
                                                            </div>
                                                        </div>) : (
                                                            <div className="direct-chat-msg right">
                                                                <div className="direct-chat-infos clearfix">
                                                                    <span className="direct-chat-name float-right">{data.name}</span>
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

                                <div className="card-footer">
                                    <form onSubmit={sendMessage}>
                                        <div className="input-group">
                                            <input type="text" name="message" placeholder="Type Message ..." autoComplete='off' className="form-control" value={formData.message} onChange={handleChange} />
                                            <span className="input-group-append">
                                                <button type="submit" className="btn btn-warning">Send</button>
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}