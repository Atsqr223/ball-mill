import React from 'react';
import { Link } from 'react-router-dom';
import './Radar3.js'; 
import './Mic3.js';
import './Accelerator3.js'

export default function SignalAnalysis3() {
    return (
        <div className="container">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">SignalAnalysis3</h1>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                    {/* Start of row for cards */}
                    <div className="row justify-content-center" style={{ marginTop: '10%' }}>
                        <div className="col-sm-4">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Radar</h5>
                                    <p className="card-text">Ensuring precise material detection and monitoring in ball mill operations.</p>
                                    <Link to="/Radar3.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Mic</h5>
                                    <p className="card-text">Monitors sound waves to detect operational irregularities in ball mill</p>
                                    <Link to="/Mic3.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Accelerator</h5>
                                    <p className="card-text">Measures rotational speed, ensuring optimal performance in ball mill operations.</p>
                                    <Link to="/Accelerator3.js">View Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End of row for cards */}
                </div>
            </div>
        </div>
    );
}
