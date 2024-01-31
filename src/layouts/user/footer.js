import React, { useState, useEffect } from 'react';

// component
export default function Footer(props) {

  return (
    <footer className="main-footer fixed-bottom">
      <strong>Copyright &copy; {props.basicData.today.getFullYear()} <a href={process.env.REACT_APP_BASE_URL}>{process.env.REACT_APP_TITLE}</a>.</strong> All rights reserved.
    </footer>
  );
}
