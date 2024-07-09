import React from 'react';
import { Link } from 'react-router-dom';
import './TCSRI/TCSRIButton.js'; 
import './IITKGP/IITKGPButton.js'; 
import './TCS/TCSButton.js'; 

export default function Feed(props) {
    document.title = 'Feed | TCS';

    return (
        <>
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0"> Feed </h1>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                    {/* Bootstrap Cards with Images */}
                    <div className='row' style={{ marginTop: '2%' }}>
                        <div className="col-md-4">
                            <div className="card">
                                <img src="assets/dist/img/TCSRI.jpg" className="card-img-top img-fluid" alt="Image 1" style={{ height: '300px', objectFit: 'fill' }} />
                                <div className="card-body">
                                    <h5 className="card-title">Image 1</h5>
                                    <p className="card-header bg-primary text-center font-weight-bold">TCS Research and Innovation</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Link to="/TCSRIButton.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <img src="assets/dist/img/IITKGP.jpg" className="card-img-top img-fluid" alt="Image 2" style={{ height: '300px', objectFit: 'fill' }} />
                                <div className="card-body">
                                    <h5 className="card-title">Image 2</h5>
                                    <p className="card-header bg-primary text-center font-weight-bold">IIT KGP</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Link to="/IITKGPButton.js">View Details</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card">
                                <img src="assets/dist/img/TCS.jpg" className="card-img-top img-fluid" alt="Image 3" style={{ height: '300px', objectFit: 'fill' }} />
                                <div className="card-body">
                                    <h5 className="card-title">Image 3</h5>
                                    <p className="card-header bg-primary text-center font-weight-bold">TCS Jamshedpur</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Link to="/TCSButton.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
