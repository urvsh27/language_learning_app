import React from 'react';
import { useAuth } from '../../context/Auth';
import DashboardScreen from '../../components/DashboardScreen';
const UserDashboard = () => {
  const [auth] = useAuth();

  return (
    <DashboardScreen title={'User Dashboard'} screenName={'User panel'}>
      <h6 className="card-text">Name: {auth?.userDetails?.name}</h6>
      <h6 className="card-text">Email: {auth?.userDetails?.email}</h6>
      <h6 className="card-text">Roles: {auth?.userRoles}</h6>
    </DashboardScreen>
  );
};

export default UserDashboard;
