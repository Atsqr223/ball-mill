import React, { useState, useEffect } from 'react';

function GetAlert({alert, message}) {
    switch (alert) {
        case 'danger':
            return (<div className="alert alert-danger alert-dismissible">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h5><i className="icon fas fa-ban"></i> Alert!</h5>
                {message}
            </div>);
        case 'info':
            return (<div className="alert alert-info alert-dismissible">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h5><i className="icon fas fa-info"></i> Alert!</h5>
                {message}
            </div>);
        case 'warning':
            return (<div className="alert alert-warning alert-dismissible">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h5><i className="icon fas fa-exclamation-triangle"></i> Alert!</h5>
                {message}
            </div>);
        case 'success':
            return (<div className="alert alert-success alert-dismissible">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h5><i className="icon fas fa-check"></i> Alert!</h5>
                {message}
            </div>);
    }
}

// component
export default function AlertBox(props) {

    return (
        <>
            <GetAlert alert={props.alert} message={props.message} />
        </>
    );
}

