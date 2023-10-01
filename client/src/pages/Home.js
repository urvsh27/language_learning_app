import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/Auth';
import './home.css';
import homePng from '../images/home.png';
const Home = () => {
  const [auth, setAuth] = useAuth();
  setAuth(auth);

  return (
    <Layout title={'Home'}>
      <div className="container main-div d-flex align-items-center justify-content-center">
        <div className="row">
          <div className="col-md-6 text-center left-text-div">
            <h1>Welcome to the Quiz App 👋🏻</h1>
            <h4>
            Read more about this quiz app Github. 
             <br></br>
             👉 <a href="https://github.com/urvsh27/quiz_app"
              className="button primary-button mr-3"
             target="_blank" rel="noopener noreferrer">Github</a>
            </h4>
          </div>
          <div className="col-md-6">
            <div className="card home-card sidebar-display">
              <img
                src={homePng}
                style={{ maxWidth: "100%", height: "auto" }}
                alt="Quiz App"
              />
              <>Image credits : https://dribbble.com/ofspaceuxui</>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
