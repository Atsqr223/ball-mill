import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";
import Swal from 'sweetalert2';

// component
import AlertBox from "../../components/AlertBox";

// helper
import { utcToLocalTime, timeAgo } from "../../utils/timeHelper";

// component
export default function MessageBoxComponent(props) {
  const { authFlag, authToken, authUser, newPostAdded } = props;
  const { socket, messageLoader, sendToDetails, messageData, setMessageData, messageType, setMessageType } = props;

  const messageEl = useRef(null);

  const [formData, setFormData] = useState({
    senderID: '',
    receiverID: '',
    message: '',
    time: new Date()
  });
  const [likeLoader, setLikeLoader] = useState(false);
  const [alertBox, setAlertBox] = useState({
    alert: '',
    message: ''
  });

  const formatDate = (gmtDate) => {
    const gmtdateObj = new Date(gmtDate);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const convertedTime = gmtdateObj.toLocaleString("en-US", {
      timeZone: localTimeZone
    });

    return convertedTime.toLocaleString();
  }

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

  useEffect(() => {
    socket.on("userTyping", (data) => {
      if (Object.keys(sendToDetails).length !== 0) {
        console.log("sendToDetails :: ", sendToDetails._id);
        console.log("data.sendFrom._id :: ", data.sendFrom._id);
        if (sendToDetails._id === data.sendFrom._id) {
          setMessageType(data.message);
        }
      }
    });

    // scroll
    if (messageEl && !messageLoader) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
    console.log("MESSAGE BOX sendToDetails :: ", sendToDetails);
  }, [sendToDetails])

  return (<>
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
  </>);
}