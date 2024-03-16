import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RWebShare } from "react-web-share";
import AlertBox from "./AlertBox";
import { utcToLocalTime, timeAgo, localToUtcTime } from "../utils/timeHelper";
import Swal from 'sweetalert2';

// component
export default function ViewPostWithComments(props) {
  const { authFlag, authToken, authUser, newPostAdded } = props;
  const { post, postIndex, updatePostArray, deleteFromPostArray } = props;
  const [likeLoader, setLikeLoader] = useState(false);

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
  const [commentFormValidateErrors, setCommentFormValidateErrors] = useState({});

  const handleChangeCommentForm = (event, post, index) => {
    const { name, value } = event.target;
    setCommentFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setCommentFormData((prevFormData) => ({ ...prevFormData, ['postId']: post._id }));
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.text.trim()) {
      errors.text = "Can't post empty comment.";
    }
    return errors;
  };

  const commentFormSubmit = async (event, post, index) => {
    event.preventDefault();
    setCommentFormData((prevFormData) => ({ ...prevFormData, submited: true }));
    const validationErrors = validateForm(commentFormData);
    if (Object.keys(validationErrors).length === 0) {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post-comment/create-comment`, {
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
    } else {
      setCommentFormValidateErrors(validationErrors);
    }
  };

  const doLike = async (event, post, index) => {
    setLikeLoader(true);
    await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post-like/create-like`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({
        auther: authUser._id,
        postId: post._id
      })
    }).then((response) => response.json()).then((postRes) => {
      setLikeLoader(false);
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

  const deletePost = (post) => {
    Swal.fire({
      title: "Do you want to delete this post ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/delete-post`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify({
            postId: post._id
          })
        }).then((response) => response.json()).then((postRes) => {
          if (postRes.success === true) {
            deleteFromPostArray(post);
          } else {
            setAlertBox((prevFormData) => ({ ...prevFormData, alert: `danger` }));
          }
        });
      } else {
        console.log('Logout cancel.');
      }
    });
  };

  return (<div className="card card-widget">
    <div className="card-header">
      <div className="user-block">
        <img className="img-circle" src={post.auther.profile_picture_url} alt="User Image" />
        <span className="username"><a href="#">{post.auther.name}</a></span>
        <span className="description">{utcToLocalTime(post.createdAt)}</span>
      </div>

      <div className="card-tools">
      </div>
    </div>

    <div className="card-body">
      <p className="text-justify" dangerouslySetInnerHTML={{ __html: post.text }}></p>
      <RWebShare
        data={{
          text: `${post.text}`,
          url: `${process.env.REACT_APP_BASE_URL}view-post/${post.slug}`,
          title: `${process.env.REACT_APP_TITLE}`,
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
      </RWebShare>
      {isLike(post.likes, authUser._id) ? <>
        {likeLoader ? <>
          <button type="button" className="btn btn-primary btn-sm ml-1">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </button>
        </> : <>
          <button type="button" className="btn btn-primary btn-sm ml-1" onClick={(e) => doLike(e, post, postIndex)}><i className="far fa-thumbs-up"></i> Liked</button>
        </>}
      </> : <>
        {likeLoader ? <>
          <button type="button" className="btn btn-default btn-sm ml-1">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </button>
        </> : <>
          <button type="button" className="btn btn-default btn-sm ml-1" onClick={(e) => doLike(e, post, postIndex)}><i className="far fa-thumbs-up"></i> Like</button>
        </>}
      </>}
      <Link to={`${process.env.REACT_APP_BASE_URL}view-post/${post.slug}`} className="float-right text-muted">{post.likes.length} likes - {post.comments.length} comments</Link>
    </div>

    {post.comments.map((comment, i) => {
      return <div className="card-footer card-comments">
        <div className="card-comment">
          <img className="img-circle img-sm" src={comment.auther.profile_picture_url} alt="User Image" />

          <div className="comment-text">
            <span className="username">
              {comment.auther.name}
              <span className="text-muted float-right">{utcToLocalTime(comment.createdAt)}</span>
            </span>
            {comment.text}
          </div>
        </div>
      </div>
    })}

    <div className="card-footer">
      <form id={`createComment${postIndex}`} onSubmit={(e) => { commentFormSubmit(e, post, postIndex) }}>
        <img className="img-fluid img-circle img-sm" src={authUser.profile_picture_url} alt="Alt Text" />
        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
        <div className="img-push">
          <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" name='text' value={commentFormData.text} onChange={(e) => { handleChangeCommentForm(e, post, postIndex) }} autoComplete='off' />
          {commentFormValidateErrors.text && <span className="text-danger">{commentFormValidateErrors.text}</span>}
        </div>
      </form>
    </div>
  </div>);
}