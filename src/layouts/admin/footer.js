import React, { useState, useEffect } from 'react';

// component
export default function Footer(props) {

    return (
        <footer className="main-footer">
            <strong>Copyright &copy; {props.basicData.today.getFullYear()} <a href={process.env.REACT_APP_ADMIN_BASE_URL}> {process.env.REACT_APP_TITLE} Admin</a>.</strong>
            &nbsp;All rights reserved.
            <div className="float-right d-none d-sm-inline-block">
                <b>Version</b> 1.0.0
            </div>
        </footer>
    );
}
