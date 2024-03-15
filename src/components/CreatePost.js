import React, { useState, useEffect } from 'react';
import AlertBox from "../components/AlertBox";

// component
export default function CreatePost(props) {
  const { authFlag, authToken, authUser, newPostAdded } = props;

  const [createPostLoader, setcreatePostLoader] = useState(false);
  const [postFormData, setPostFormData] = useState({
    text: "",
    submited: false
  });
  const [postFormValidateErrors, setPostFormValidateErrors] = useState({});
  const [alertBox, setAlertBox] = useState({
    alert: '',
    message: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.text.trim()) {
      errors.text = "Can't post empty content.";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setcreatePostLoader(true);
    setPostFormData((prevFormData) => ({ ...prevFormData, submited: true }));
    const validationErrors = validateForm(postFormData);
    setPostFormValidateErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/create-post`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(postFormData)
      }).then((response) => response.json()).then((postRes) => {
        setcreatePostLoader(false);
        if (postRes.success === true) {
          document.getElementById("createPost").reset();
          setPostFormData((prevFormData) => ({ ...prevFormData, text: '' }));
          setPostFormData((prevFormData) => ({ ...prevFormData, submited: false }));
          setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'success' }));
          setAlertBox((prevFormData) => ({ ...prevFormData, message: postRes.message }));
          setTimeout(() => {
            setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
            setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
          }, 5000);
          newPostAdded(postRes.data.post);
        } else {
          setAlertBox((prevFormData) => ({ ...prevFormData, alert: 'danger' }));
          setAlertBox((prevFormData) => ({ ...prevFormData, message: postRes.message }));
          setTimeout(() => {
            setAlertBox((prevFormData) => ({ ...prevFormData, alert: '' }));
            setAlertBox((prevFormData) => ({ ...prevFormData, message: '' }));
          }, 5000);
        }
      });
    } else {
      setcreatePostLoader(false);
    }
  };

  return (
    <>
      <AlertBox alert={alertBox.alert} message={alertBox.message} />
      <div className="card card-primary">
        <div className="card-header">
          <h3 className="card-title">Write your content</h3>
        </div>
        <form id="createPost" onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="form-group">
              <textarea className="form-control" rows="3" name="text" placeholder="What in your mind" value={postFormData.text} onChange={handleChange}></textarea>
            </div>
            {postFormValidateErrors.text && <span className="text-danger">{postFormValidateErrors.text}</span>}
          </div>

          <div className="card-footer">
            {!createPostLoader ?
              <button type="submit" className="btn btn-primary" disabled={createPostLoader}>
                Posts
              </button> :
              <div className="spinner-border text-primary float-right"></div>
            }
          </div>
        </form>
      </div>
    </>);
}