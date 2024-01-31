import React, { useState, useEffect } from 'react';

// component
export default function ComponentThree(props) {
  return (
    <>
      {(props.loader) ? (<h2>Loader...</h2>) : <></>}
      <button type='button' onClick={props._onClick}>Click & Check</button>
    </>
  );
}