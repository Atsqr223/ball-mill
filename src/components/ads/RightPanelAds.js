import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

// component
export default function RightPanelAds(props) {
    const { authFlag, authToken, authUser } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    return (
        <>
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
                        Subha Prasad <br />
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
        </>
    );
}