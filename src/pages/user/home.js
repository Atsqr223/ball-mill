import React from 'react';

export default function Home(props) {
    document.title = 'TCS welcomes you | Home Page';

    return (
        <div style={{ marginTop: '10%' }}>
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                    {/* Bootstrap Cards with YouTube Videos */}
                    <div className='row'>
                        <div className="col-md-4">
                            <div className="card"> {/* Apply inline style for background color */}
                                <div className="card-header bg-primary text-center font-weight-bold">TCS Research and Innovation</div>
                                <div className="card-body">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                            className="embed-responsive-item"
                                            src="https://www.youtube.com/embed/Xe5jAu1dJ0c?rel=0"
                                            allowFullScreen
                                            title="YouTube video"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card"> {/* Apply inline style for background color */}
                                <div className="card-header bg-primary text-center font-weight-bold">IIT KGP</div>
                                <div className="card-body">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                            className="embed-responsive-item"
                                            src="https://www.youtube.com/embed/eWHPR1KH8eQ"
                                            allowFullScreen
                                            title="YouTube video"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card"> {/* Apply inline style for background color */}
                                <div className="card-header bg-primary text-center font-weight-bold">TCS Jamshedpur</div>
                                <div className="card-body">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                            className="embed-responsive-item"
                                            src="https://www.youtube.com/embed/GyYYYhprhYQ"
                                            allowFullScreen
                                            title="YouTube video"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
