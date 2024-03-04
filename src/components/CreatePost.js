import React, { useState, useEffect } from 'react';
import AlertBox from "../components/AlertBox";

// component
export default function CreatePost(props) {
  const { authFlag, authToken, authUser, fetchDataReset } = props;

  const [createPostLoader, setcreatePostLoader] = useState(false);
  const [postFormData, setPostFormData] = useState({
    content: "",
    id: "",
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
    setPostFormData((prevFormData) => ({ ...prevFormData, ['id']: authUser._id }));
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.content.trim()) {
      errors.content = "Can't post empty content.";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setcreatePostLoader(true);
    setPostFormData((prevFormData) => ({ ...prevFormData, submited: true }));
    const validationErrors = validateForm(postFormData);
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
        setAlertBox((prevFormData) => ({ ...prevFormData, message: `${postRes.message}` }));
        if (postRes.success === true) {
          document.getElementById("createPost").reset();
          setPostFormData((prevFormData) => ({ ...prevFormData, ['content']: '' }));
          setAlertBox((prevFormData) => ({ ...prevFormData, alert: `success` }));
          fetchDataReset();
        } else {
          setAlertBox((prevFormData) => ({ ...prevFormData, alert: `danger` }));
        }
      });
    } else {
      setcreatePostLoader(false);
      setPostFormValidateErrors(validationErrors);
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
              <textarea className="form-control" rows="3" name="content" placeholder="What in your mind" value={postFormData.contest} onChange={handleChange}></textarea>
            </div>
            {postFormValidateErrors.content && <span className="text-danger">{postFormValidateErrors.content}</span>}
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