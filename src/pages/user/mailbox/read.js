import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function Read(props) {

    // page title
    document.title = "Subha welcomes you | " + props.title;

    const navigate = useNavigate();

    useEffect(() => {
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
                <section className="container">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-3 d-none d-sm-block d-sm-none d-md-block d-md-none d-lg-block d-lg-none d-xl-block overflow-auto" style={{ height: '100vh' }}>
                                <Link to="/mail/inbox" className="btn btn-primary btn-block mb-3">Back to Inbox</Link>

                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Folders</h3>

                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <ul className="nav nav-pills flex-column">
                                            <li className="nav-item active">
                                                <Link to="/mail/inbox" className="nav-link">
                                                    <i className="fas fa-inbox"></i> Inbox
                                                    <span className="badge bg-primary float-right">12</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/mail/sent" className="nav-link">
                                                    <i className="far fa-envelope"></i> Sent
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/mail/drafts" className="nav-link">
                                                    <i className="far fa-file-alt"></i> Drafts
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/mail/junk" className="nav-link">
                                                    <i className="fas fa-filter"></i> Junk
                                                    <span className="badge bg-warning float-right">65</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/mail/trash" className="nav-link">
                                                    <i className="far fa-trash-alt"></i> Trash
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Labels</h3>

                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <ul className="nav nav-pills flex-column">
                                            <li className="nav-item">
                                                <a className="nav-link" href="#"><i className="far fa-circle text-danger"></i> Important</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#"><i className="far fa-circle text-warning"></i> Promotions</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#"><i className="far fa-circle text-primary"></i> Social</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9 overflow-auto" style={{ height: '100vh' }}>
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Read Mail</h3>

                                        <div className="card-tools">
                                            <a href="#" className="btn btn-tool" title="Previous"><i className="fas fa-chevron-left"></i></a>
                                            <a href="#" className="btn btn-tool" title="Next"><i className="fas fa-chevron-right"></i></a>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="mailbox-read-info">
                                            <h5>Message Subject Is Placed Here</h5>
                                            <h6>From: support@adminlte.io
                                                <span className="mailbox-read-time float-right">15 Feb. 2015 11:03 PM</span></h6>
                                        </div>
                                        <div className="mailbox-controls with-border text-center">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default btn-sm" data-container="body" title="Delete">
                                                    <i className="far fa-trash-alt"></i>
                                                </button>
                                                <button type="button" className="btn btn-default btn-sm" data-container="body" title="Reply">
                                                    <i className="fas fa-reply"></i>
                                                </button>
                                                <button type="button" className="btn btn-default btn-sm" data-container="body" title="Forward">
                                                    <i className="fas fa-share"></i>
                                                </button>
                                            </div>
                                            <button type="button" className="btn btn-default btn-sm" title="Print">
                                                <i className="fas fa-print"></i>
                                            </button>
                                        </div>

                                        <div className="mailbox-read-message">
                                            <p>Hello John,</p>

                                            <p>Keffiyeh blog actually fashion axe vegan, irony biodiesel. Cold-pressed hoodie chillwave put a bird
                                                on it aesthetic, bitters brunch meggings vegan iPhone. Dreamcatcher vegan scenester mlkshk. Ethical
                                                master cleanse Bushwick, occupy Thundercats banjo cliche ennui farm-to-table mlkshk fanny pack
                                                gluten-free. Marfa butcher vegan quinoa, bicycle rights disrupt tofu scenester chillwave 3 wolf moon
                                                asymmetrical taxidermy pour-over. Quinoa tote bag fashion axe, Godard disrupt migas church-key tofu
                                                blog locavore. Thundercats cronut polaroid Neutra tousled, meh food truck selfies narwhal American
                                                Apparel.</p>

                                            <p>Raw denim McSweeney's bicycle rights, iPhone trust fund quinoa Neutra VHS kale chips vegan PBR&amp;B
                                                literally Thundercats +1. Forage tilde four dollar toast, banjo health goth paleo butcher. Four dollar
                                                toast Brooklyn pour-over American Apparel sustainable, lumbersexual listicle gluten-free health goth
                                                umami hoodie. Synth Echo Park bicycle rights DIY farm-to-table, retro kogi sriracha dreamcatcher PBR&amp;B
                                                flannel hashtag irony Wes Anderson. Lumbersexual Williamsburg Helvetica next level. Cold-pressed
                                                slow-carb pop-up normcore Thundercats Portland, cardigan literally meditation lumbersexual crucifix.
                                                Wayfarers raw denim paleo Bushwick, keytar Helvetica scenester keffiyeh 8-bit irony mumblecore
                                                whatever viral Truffaut.</p>

                                            <p>Post-ironic shabby chic VHS, Marfa keytar flannel lomo try-hard keffiyeh cray. Actually fap fanny
                                                pack yr artisan trust fund. High Life dreamcatcher church-key gentrify. Tumblr stumptown four dollar
                                                toast vinyl, cold-pressed try-hard blog authentic keffiyeh Helvetica lo-fi tilde Intelligentsia. Lomo
                                                locavore salvia bespoke, twee fixie paleo cliche brunch Schlitz blog McSweeney's messenger bag swag
                                                slow-carb. Odd Future photo booth pork belly, you probably haven't heard of them actually tofu ennui
                                                keffiyeh lo-fi Truffaut health goth. Narwhal sustainable retro disrupt.</p>

                                            <p>Skateboard artisan letterpress before they sold out High Life messenger bag. Bitters chambray
                                                leggings listicle, drinking vinegar chillwave synth. Fanny pack hoodie American Apparel twee. American
                                                Apparel PBR listicle, salvia aesthetic occupy sustainable Neutra kogi. Organic synth Tumblr viral
                                                plaid, shabby chic single-origin coffee Etsy 3 wolf moon slow-carb Schlitz roof party tousled squid
                                                vinyl. Readymade next level literally trust fund. Distillery master cleanse migas, Vice sriracha
                                                flannel chambray chia cronut.</p>

                                            <p>Thanks,<br />Jane</p>
                                        </div>
                                    </div>

                                    <div className="card-footer bg-white">
                                        <ul className="mailbox-attachments d-flex align-items-stretch clearfix">
                                            <li>
                                                <span className="mailbox-attachment-icon"><i className="far fa-file-pdf"></i></span>

                                                <div className="mailbox-attachment-info">
                                                    <a href="#" className="mailbox-attachment-name"><i className="fas fa-paperclip"></i> Sep2014-report.pdf</a>
                                                    <span className="mailbox-attachment-size clearfix mt-1">
                                                        <span>1,245 KB</span>
                                                        <a href="#" className="btn btn-default btn-sm float-right"><i className="fas fa-cloud-download-alt"></i></a>
                                                    </span>
                                                </div>
                                            </li>
                                            <li>
                                                <span className="mailbox-attachment-icon"><i className="far fa-file-word"></i></span>

                                                <div className="mailbox-attachment-info">
                                                    <a href="#" className="mailbox-attachment-name"><i className="fas fa-paperclip"></i> App Description.docx</a>
                                                    <span className="mailbox-attachment-size clearfix mt-1">
                                                        <span>1,245 KB</span>
                                                        <a href="#" className="btn btn-default btn-sm float-right"><i className="fas fa-cloud-download-alt"></i></a>
                                                    </span>
                                                </div>
                                            </li>
                                            <li>
                                                <span className="mailbox-attachment-icon has-img"><img src="../../dist/img/photo1.png" alt="Attachment" /></span>

                                                <div className="mailbox-attachment-info">
                                                    <a href="#" className="mailbox-attachment-name"><i className="fas fa-camera"></i> photo1.png</a>
                                                    <span className="mailbox-attachment-size clearfix mt-1">
                                                        <span>2.67 MB</span>
                                                        <a href="#" className="btn btn-default btn-sm float-right"><i className="fas fa-cloud-download-alt"></i></a>
                                                    </span>
                                                </div>
                                            </li>
                                            <li>
                                                <span className="mailbox-attachment-icon has-img"><img src="../../dist/img/photo2.png" alt="Attachment" /></span>

                                                <div className="mailbox-attachment-info">
                                                    <a href="#" className="mailbox-attachment-name"><i className="fas fa-camera"></i> photo2.png</a>
                                                    <span className="mailbox-attachment-size clearfix mt-1">
                                                        <span>1.9 MB</span>
                                                        <a href="#" className="btn btn-default btn-sm float-right"><i className="fas fa-cloud-download-alt"></i></a>
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-footer">
                                        <div className="float-right">
                                            <button type="button" className="btn btn-default"><i className="fas fa-reply"></i> Reply</button>
                                            <button type="button" className="btn btn-default"><i className="fas fa-share"></i> Forward</button>
                                        </div>
                                        <button type="button" className="btn btn-default"><i className="far fa-trash-alt"></i> Delete</button>
                                        <button type="button" className="btn btn-default"><i className="fas fa-print"></i> Print</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}