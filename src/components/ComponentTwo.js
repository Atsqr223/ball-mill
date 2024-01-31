import React, { useState, useEffect } from 'react';

export default function ComponentTwo(props) {
  return (
    <>
      {(!props.loader) ? (<h2>Success fully fetch.</h2>) : <></>}
    </>
  );
}