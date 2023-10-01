import React from 'react'
import DashboardScreen from '../../components/DashboardScreen';


const Users = () => {
  return (
    <DashboardScreen title={'All Users'} screenName={'All Users'}>
         <div className="d-flex gap-3 mb-3"> {/* Use d-flex and justify-content-between for horizontal spacing */}
        <button className="btn btn-primary">Create exercise</button>
        <button className="btn btn-primary" onClick={()=>{    window.history.back();}}>Go Back</button>
      </div>
    </DashboardScreen>
  )
}

export default Users;