import React from 'react'
import BarLoader from 'react-spinners/BarLoader';

const LoaderBar = () => {
  return (
    <><center className="m-3">
    <BarLoader height={4} width={200} />
    <p className="page-text">Loading...</p>
  </center></>
  )
}

export default LoaderBar;