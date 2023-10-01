import React from 'react'
import Layout from './Layout'
import './dashboardScreen.css';
const DashboardScreen = ({title,screenName,children, }) => {
  return (
    <Layout title={title}>
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="card border-secondary shadow dashboard-screen">
          <div className="card-header">
              <h5 className="card-title">{screenName}</h5>
            </div>
            <div className="card-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  )
}

export default DashboardScreen;