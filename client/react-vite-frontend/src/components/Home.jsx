// Home.js
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkTokenValidity } from '../utils/authUtils';


function Home() {
  
  const [vitals, setVitals] = useState(null);
  const [dailyMotivations, setDailyMotivations] = useState(null);
  const [loginStatus, setLoginStatus] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState(''); 
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    async function fetchDailyMotivations() {
      try {
        const response = await fetch('http://localhost:3000/daily-motivation/all');
        const data = await response.json();
        console.log(data); 

        setDailyMotivations(data);
      } catch (error) {
        console.error('Error fetching daily motivations:', error);
      }
    }
  
      async function fetchVitals() {
        try {
          const response = await fetch('http://localhost:3000/vital/all');

          const data = await response.json();
          setVitals(data);
        } catch (error) {
          console.error('Error fetching vitals:', error);
        }
      }

      checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
      fetchDailyMotivations();
      fetchVitals();
  }, []);

  return (
    
    <div className='container'>

    {/* Display welcome message and logout button if user is logged in */}
    {loginStatus && loginStatus !== 'auth' ? 
      <p className="mt-3">Greetings, {loggedInEmail}! You are currently signed in as a <b>{userRole}</b>.</p> : 
    <div className="container">
      <h1 className="mt-5 text-center">Welcome to our Healthcare Portal!</h1>
      <hr></hr>

      <p className="lead">
        Our healthcare portal is designed to provide convenient access to various healthcare services and information for both patient and nurse.
      </p>

      <div className="mt-4">
        <h3 >Our client application helps nurse practitioners to monitor patients during the first weeks of their release from the hospital and also help the patients to monitor their daily activities. </h3>
      </div>

      <p className="mt-4">
        Get started by signing in or creating an account to access all the features of our healthcare portal.
      </p>
    </div>

    }
        
    {/* Display daily motivations for patients */}
    {userRole === 'patient' && dailyMotivations && loginStatus && loginStatus !== 'auth' && (
      <div className="mt-3">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {dailyMotivations.map((motivation) => (
            <div key={motivation._id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Author: {motivation.author}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Timestamp: {new Date(motivation.createdAt).toLocaleString()}</h6>
                  <p className="card-text">{motivation.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Display vitals for nurses */}
    {userRole === 'nurse' && vitals && loginStatus && loginStatus !== 'auth' && (
      <div className='mt-3'>
        {/* Search input field */}
        <input 
          type="text" 
          placeholder="Search by patient name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Timestamp</th>
              <th>Heart Rate</th>
              <th>Blood Pressure</th>
              <th>Temperature</th>
              <th>Respiratory Rate</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Filter and map through the filtered vitals */}
            {vitals.filter(vital => vital.patient.toLowerCase().includes(searchQuery.toLowerCase())).map((vital) => (
              <tr key={vital._id}>
                <td>{vital.patient}</td>
                <td>{new Date(vital.timestamp).toLocaleString()}</td> 
                <td>{vital.heartRate}</td>
                <td>{vital.bloodPressure}</td>
                <td>{vital.temperature}</td>
                <td>{vital.respiratoryRate}</td>
                <td>
                  {loginStatus && loginStatus !== 'auth' && (
                    <button className="btn btn-warning" type="button" onClick={() => navigate(`/updatevital/${vital._id}`)}>
                      Edit
                    </button> 
                  )}
                </td>
                {/* <td>
                  {loginStatus && loginStatus !== 'auth' && (
                    <button className="btn btn-danger" type="button" onClick={handleLogout}>Delete</button> 
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {userRole === 'nurse' && vitals && loginStatus && loginStatus !== 'auth' && (
      <div className='mt-3'>
        <button className="btn btn-success" type="button" onClick={() => navigate('/createvital')}>
          Create Vital
        </button>
      </div>
    )}
    </div>
  );
}

export default Home;