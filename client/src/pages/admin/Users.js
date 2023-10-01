import React, { useEffect, useState } from 'react';
import DashboardScreen from '../../components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import { IsNotNullOrEmpty } from '../../utils/enum';
import LoaderBar from '../../components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    axios
      .get(`${backendApi}users`)
      .then((response) => {
        setUsers(response.data.data);
        toast.success(response.data.message);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      });
  }, []);

  return (
    <DashboardScreen title={'Users'} screenName={'All Users'}>
      <Toaster />
      <div className="row">
        {loader ? (
          <LoaderBar />
        ) : (
          <div className="col-md-12">
            {IsNotNullOrEmpty(users) ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userName}</td>
                      <td>{user.userEmail}</td>
                      <td>{user.activated===true ? (<>< div className="btn btn-success">active</div></>): (<><>< div className="btn btn-success">not Active</div></></>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No users available.</p>
            )}
          </div>
        )}
      </div>
    </DashboardScreen>
  );
};

export default Users;
