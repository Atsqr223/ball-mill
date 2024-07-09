import React from 'react';
import { Link } from 'react-router-dom';
import './SignalAnalysis1.js'; 
import './SignalAcquisition1.js'; 

export default function TCSRIButton() {
    return (
        <div className="container">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0"> TCSRIButton </h1>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                    <div className="row" style={{ marginTop: '10%' }}>
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="card" style={{ width: '18rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Signal Analysis</h5>
                                    <p className="card-text">Interpreting data to enhance ball mill efficiency and reliability.</p>
                                    <Link to="/SignalAnalysis1.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="card" style={{ width: '18rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Signal Acquisition</h5>
                                    <p className="card-text">Capturing operational data for monitoring and optimizing ball mill performance.</p>
                                    <Link to="/SignalAcquisition1.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
