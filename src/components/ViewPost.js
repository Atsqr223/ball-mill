import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";
import AlertBox from "./AlertBox";
import { utcToLocalTime } from "../utils/timeHelper";

// component
export default function ViewPost(props) {
  const { authFlag, authToken, authUser, newPostAdded } = props;
  const { post, postIndex, updatePostArray } = props;

  const [alertBox, setAlertBox] = useState({
    alert: '',
    message: ''
  });

  // comments
  const [commentFormData, setCommentFormData] = useState({
    text: "",
    postId: "",
    submited: false
  });

  const handleChangeCommentForm = (event, post, index) => {
    const { name, value } = event.target;
    setCommentFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setCommentFormData((prevFormData) => ({ ...prevFormData, ['postId']: post._id }));
  };

  const commentFormSubmit = async (event, post, index) => {
    event.preventDefault();
    setCommentFormData((prevFormData) => ({ ...prevFormData, submited: true }));
    await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post-comment/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify(commentFormData)
    }).then((response) => response.json()).then((postRes) => {
      if (postRes.success === true) {
        document.getElementById(`createComment${index}`).reset();
        setCommentFormData((prevFormData) => ({ ...prevFormData, ['text']: '' }));
        updatePostArray(postRes.data.post);
      } else {
        setAlertBox((prevFormData) => ({ ...prevFormData, alert: `danger` }));
      }
    });
  };

  const doLike = async (event, post, index) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post-like/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({
        createdBy: authUser._id,
        postId: post._id
      })
    }).then((response) => response.json()).then((postRes) => {
      if (postRes.success === true) {
        updatePostArray(postRes.data.post);
      } else {
        setAlertBox((prevFormData) => ({ ...prevFormData, alert: `danger` }));
      }
    });
  };

  const isLike = (array, findBy) => {
    return array.find((element) => {
      return element._id === findBy;
    })
  }

  return (<div className="card card-widget">
    <div className="card-header">
      <div className="user-block">
        <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
        <span className="username"><a href="#">{post.auther.name}</a></span>
        <span className="description">{utcToLocalTime(post.createdAt)}</span>
      </div>

      <div className="card-tools">
        <button type="button" className="btn btn-tool" data-card-widget="remove">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div className="card-body">
      <p className="text-justify" dangerouslySetInnerHTML={{ __html: post.text }}></p>
      <RWebShare
        data={{
          text: `${process.env.REACT_APP_DESCRIPTION}`,
          url: `${process.env.REACT_APP_BASE_URL}`,
          title: `${process.env.REACT_APP_TITLE}`,
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
      </RWebShare>
      {isLike(post.likes, authUser._id) ? <>
        <button type="button" className="btn btn-primary btn-sm ml-1" onClick={(e) => doLike(e, post, postIndex)}><i className="far fa-thumbs-up"></i> Like</button>
      </> : <>
        <button type="button" className="btn btn-default btn-sm ml-1" onClick={(e) => doLike(e, post, postIndex)}><i className="far fa-thumbs-up"></i> Like</button>
      </>}
      <span className="float-right text-muted">{post.likes.length} likes - {post.comments.length} comments</span>
    </div>

    {post.comments.length > 0 ? <div className="card-footer card-comments">
      <div className="card-comment">
        <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

        <div className="comment-text">
          <span className="username">
            {post.comments[post.comments.length - 1].auther.name}
            <span className="text-muted float-right">{utcToLocalTime(post.comments[post.comments.length - 1].createdAt)}</span>
          </span>
          {post.comments[post.comments.length - 1].text}
        </div>
      </div>
    </div> : <>
    </>}

    <div className="card-footer">
      <form id={`createComment${postIndex}`} onSubmit={(e) => { commentFormSubmit(e, post, postIndex) }}>
        <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
        <div className="img-push">
          <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" name='text' value={commentFormData.text} onChange={(e) => { handleChangeCommentForm(e, post, postIndex) }} autoComplete='off' />
        </div>
      </form>
    </div>
  </div>);
}