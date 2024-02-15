import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function Feeds(props) {

    // page title
    document.title = "Welcome to We connect | Feed's";
    const [items, setItems] = useState([]);
    const [like, setLike] = useState([
        { like: false },
        { like: false },
        { like: false },
        { like: false },
        { like: false },
        { like: false },
        { like: false }
    ]);

    const navigate = useNavigate();

    // fetch data
    const fetchData = async () => {
        let token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}api/v1/post/get-all`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
    
            setItems(data.data.users);
            // setPage(prevPage => prevPage + 1);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const doLike = (index) => {
        const likes = like.map((l, i) => {
            if (i === index) {
                return {
                    ...l,
                    like: !like[index].like
                };
            } else {
                return l;
            }
        });
        // Re-render with the new array
        setLike(likes);
    }

    useEffect(() => {
        fetchData();
      }, []);

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
                <div className="container">
                    <div className='row'>
                        <div className='col-md-3 d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block overflow-auto' style={{ height: '100vh' }}>
                            <div className="card card-widget widget-user-2 shadow-sm">
                                {/* <!-- Add the bg color to the header using any of the bg-* classes --> */}
                                <div className="widget-user-header bg-warning">
                                    <div className="widget-user-image">
                                        <img className="img-circle elevation-2" src="/assets/dist/img/user7-128x128.jpg" alt="User Avatar" />
                                    </div>
                                    <h3 className="widget-user-username">Nadia Carmichael</h3>
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

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title text-bold">
                                        Sample 1
                                    </h3>
                                </div>

                                <div className="card-body">
                                    <ul>
                                        <li>Lorem ipsum dolor sit amet</li>
                                        <li>Consectetur adipiscing elit</li>
                                        <li>Nulla volutpat aliquam velit
                                            <ul>
                                                <li>Phasellus iaculis neque</li>
                                                <li>Purus sodales ultricies</li>
                                            </ul>
                                        </li>
                                        <li>Aenean sit amet erat nunc</li>
                                        <li>Eget porttitor lorem</li>
                                        <li>Eget porttitor lorem</li>
                                        <li>Eget porttitor lorem</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 overflow-auto" style={{ height: '100vh' }}>
                            <div className="card card-widget">
                                <div className="card-header">
                                    <div className="user-block">
                                        <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
                                        <span className="username"><a href="#">Jonathan Burke Jr.</a></span>
                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                    </div>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <img className="img-fluid pad" src='/assets/dist/img/photo2.png' alt="Photo" />

                                    <p>I took this photo this morning. What do you guys think?</p>
                                    <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                    {like[0].like ? <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(0)}><i className="far fa-thumbs-up"></i> Like</button> :
                                        <button type="button" className="btn btn-default btn-sm ml-1" onClick={() =>doLike(0)}><i className="far fa-thumbs-up"></i> Like</button>}
                                    <span className="float-right text-muted">127 likes - 3 comments</span>
                                </div>

                                <div className="card-footer card-comments">
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Maria Gonzales
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>

                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Luna Stark
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <form action="#" method="post">
                                        <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
                                        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
                                        <div className="img-push">
                                            <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card card-widget">
                                <div className="card-header">
                                    <div className="user-block">
                                        <img className="img-circle" src="/assets/dist/img/user1-128x128.jpg" alt="User Image" />
                                        <span className="username"><a href="#">Jonathan Burke Jr.</a></span>
                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                    </div>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p>Far far away, behind the word mountains, far from the
                                        countries Vokalia and Consonantia, there live the blind
                                        texts. Separated they live in Bookmarksgrove right at</p>

                                    <p>the coast of the Semantics, a large language ocean.
                                        A small river named Duden flows by their place and supplies
                                        it with the necessary regelialia. It is a paradisematic
                                        country, in which roasted parts of sentences fly into
                                        your mouth.</p>
                                    <div className="attachment-block clearfix">
                                        <img className="attachment-img" src="/assets/dist/img/photo1.png" alt="Attachment Image" />

                                        <div className="attachment-pushed">
                                            <h4 className="attachment-heading"><a href="https://www.lipsum.com/">Lorem ipsum text generator</a></h4>

                                            <div className="attachment-text">
                                                Description about the attachment can be placed here.
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry... <a href="#">more</a>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                    {like[1].like ? <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(1)}><i className="far fa-thumbs-up"></i> Like</button> :
                                        <button type="button" className="btn btn-default btn-sm ml-1" onClick={() => doLike(1)}><i className="far fa-thumbs-up"></i> Like</button>}
                                    <span className="float-right text-muted">45 likes - 2 comments</span>
                                </div>

                                <div className="card-footer card-comments">
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src="/assets/dist/img/user3-128x128.jpg" alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Maria Gonzales
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src="/assets/dist/img/user5-128x128.jpg" alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Nora Havisham
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            The point of using Lorem Ipsum is that it hrs a morer-less
                                            normal distribution of letters, as opposed to using
                                            'Content here, content here', making it look like readable English.
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <form action="#" method="post">
                                        <img className="img-fluid img-circle img-sm" src="/assets/dist/img/user4-128x128.jpg" alt="Alt Text" />
                                        <div className="img-push">
                                            <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card card-widget">
                                <div className="card-header">
                                    <div className="user-block">
                                        <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
                                        <span className="username"><a href="#">Jonathan Burke Jr.</a></span>
                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                    </div>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <img className="img-fluid pad" src='/assets/dist/img/photo2.png' alt="Photo" />

                                    <p>I took this photo this morning. What do you guys think?</p>
                                    <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                    {like[2].like ? <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(2)}><i className="far fa-thumbs-up"></i> Like</button> :
                                        <button type="button" className="btn btn-default btn-sm ml-1" onClick={() => doLike(2)}><i className="far fa-thumbs-up"></i> Like</button>}
                                    <span className="float-right text-muted">127 likes - 3 comments</span>
                                </div>

                                <div className="card-footer card-comments">
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Maria Gonzales
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>

                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Luna Stark
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <form action="#" method="post">
                                        <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
                                        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
                                        <div className="img-push">
                                            <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card card-widget">
                                <div className="card-header">
                                    <div className="user-block">
                                        <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
                                        <span className="username"><a href="#">Jonathan Burke Jr.</a></span>
                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                    </div>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <img className="img-fluid pad" src='/assets/dist/img/photo2.png' alt="Photo" />

                                    <p>I took this photo this morning. What do you guys think?</p>
                                    <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                    {like[3].like ? <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(3)}><i className="far fa-thumbs-up"></i> Like</button> :
                                        <button type="button" className="btn btn-default btn-sm ml-1" onClick={() => doLike(3)}><i className="far fa-thumbs-up"></i> Like</button>}
                                    <span className="float-right text-muted">127 likes - 3 comments</span>
                                </div>

                                <div className="card-footer card-comments">
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Maria Gonzales
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>

                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Luna Stark
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <form action="#" method="post">
                                        <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
                                        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
                                        <div className="img-push">
                                            <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card card-widget">
                                <div className="card-header">
                                    <div className="user-block">
                                        <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
                                        <span className="username"><a href="#">Jonathan Burke Jr.</a></span>
                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                    </div>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <img className="img-fluid pad" src='/assets/dist/img/photo2.png' alt="Photo" />

                                    <p>I took this photo this morning. What do you guys think?</p>
                                    <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                    {like[4].like ? <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(4)}><i className="far fa-thumbs-up"></i> Like</button> :
                                        <button type="button" className="btn btn-default btn-sm ml-1" onClick={() => doLike(4)}><i className="far fa-thumbs-up"></i> Like</button>}
                                    <span className="float-right text-muted">127 likes - 3 comments</span>
                                </div>

                                <div className="card-footer card-comments">
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Maria Gonzales
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>

                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Luna Stark
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <form action="#" method="post">
                                        <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
                                        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
                                        <div className="img-push">
                                            <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card card-widget">
                                <div className="card-header">
                                    <div className="user-block">
                                        <img className="img-circle" src='/assets/dist/img/user1-128x128.jpg' alt="User Image" />
                                        <span className="username"><a href="#">Jonathan Burke Jr.</a></span>
                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                    </div>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <img className="img-fluid pad" src='/assets/dist/img/photo2.png' alt="Photo" />

                                    <p>I took this photo this morning. What do you guys think?</p>
                                    <button type="button" className="btn btn-default btn-sm"><i className="fas fa-share"></i> Share</button>
                                    {like[5].like ? <button type="button" className="btn btn-primary btn-sm ml-1" onClick={() => doLike(5)}><i className="far fa-thumbs-up"></i> Like</button> :
                                        <button type="button" className="btn btn-default btn-sm ml-1" onClick={() => doLike(5)}><i className="far fa-thumbs-up"></i> Like</button>}
                                    <span className="float-right text-muted">127 likes - 3 comments</span>
                                </div>

                                <div className="card-footer card-comments">
                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user3-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Maria Gonzales
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>

                                    <div className="card-comment">
                                        <img className="img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="User Image" />

                                        <div className="comment-text">
                                            <span className="username">
                                                Luna Stark
                                                <span className="text-muted float-right">8:03 PM Today</span>
                                            </span>
                                            It is a long established fact that a reader will be distracted
                                            by the readable content of a page when looking at its layout.
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <form action="#" method="post">
                                        <img className="img-fluid img-circle img-sm" src='/assets/dist/img/user4-128x128.jpg' alt="Alt Text" />
                                        {/* <!-- .img-push is used to add margin to elements next to floating images --> */}
                                        <div className="img-push">
                                            <input type="text" className="form-control form-control-sm" placeholder="Press enter to post comment" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-3 overflow-auto' style={{ height: '100vh' }}>
                            <div className="card">
                                <div className="card-body">
                                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                        <ol className="carousel-indicators">
                                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                                        </ol>
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <img className="d-block w-100" src="https://placehold.it/900x500/39CCCC/ffffff&text=I+Love+Bootstrap" alt="First slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="https://placehold.it/900x500/3c8dbc/ffffff&text=I+Love+Bootstrap" alt="Second slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="https://placehold.it/900x500/f39c12/ffffff&text=I+Love+Bootstrap" alt="Third slide" />
                                            </div>
                                        </div>
                                        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                            <span className="carousel-control-custom-icon" aria-hidden="true">
                                                <i className="fas fa-chevron-left"></i>
                                            </span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                            <span className="carousel-control-custom-icon" aria-hidden="true">
                                                <i className="fas fa-chevron-right"></i>
                                            </span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-2">
                                <img className="card-img-top" src="/assets/dist/img/photo3.jpg" alt="Dist Photo 3" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title text-primary">Card Title</h5>
                                    <p className="card-text pb-1 pt-1 text-white">
                                        Lorem ipsum dolor <br />
                                        sit amet, consectetur <br />
                                        adipisicing elit sed <br />
                                        do eiusmod tempor. </p>
                                    <a href="#" className="text-primary">Last update 3 days ago</a>
                                </div>
                            </div>

                            <div className="card mb-2 bg-gradient-dark">
                                <img className="card-img-top" src="/assets/dist/img/photo1.png" alt="Dist Photo 1" />
                                <div className="card-img-overlay d-flex flex-column justify-content-end">
                                    <h5 className="card-title text-primary text-white">Card Title</h5>
                                    <p className="card-text text-white pb-2 pt-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor.</p>
                                    <a href="#" className="text-white">Last update 2 mins ago</a>
                                </div>
                            </div>

                            <div className="card mb-2">
                                <img className="card-img-top" src="/assets/dist/img/photo3.jpg" alt="Dist Photo 3" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title text-primary">Card Title</h5>
                                    <p className="card-text pb-1 pt-1 text-white">
                                        Lorem ipsum dolor <br />
                                        sit amet, consectetur <br />
                                        adipisicing elit sed <br />
                                        do eiusmod tempor. </p>
                                    <a href="#" className="text-primary">Last update 3 days ago</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}