import React, { useState, useEffect } from 'react';

// component
export default function ComponentOne(props) {
  return (
    <>
      {(props.loader) ? (<h2>Loader...</h2>) : <></>}
      <button type='button' onClick={props.getUserList}>Refresh list</button>
      <button type='button' onClick={props.deleteAllUser}>Delete All</button>
    </>
  );
}