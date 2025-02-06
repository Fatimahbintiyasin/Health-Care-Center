import './App.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './components/Login';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import CreateVital from './components/CreateVital';
import CreateAlert from './components/CreateAlert';
import UpdateVital from './components/UpdateVital';
import PatientAlerts from './components/PatientAlerts';
import CovidSurvey from './components/CovidSurvey';
import PredictDisease from './components/PredictDisease';
import CreateDailyMotivation from './components/CreateDailyMotivation';
import { checkTokenValidity } from './utils/authUtils';

function App() {

  const [token, setToken] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState(''); 

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.message === 'Logged out successfully!') {
        console.log("Logged out successfully!")
        localStorage.removeItem('token'); 
      }
      window.location.href = '/home'; 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <Router>
      <Navbar className="custom-navbar" variant="dark" expand="lg" style={{ marginBottom: '5%'}}>
        <Container>
          <Navbar.Brand as={Link} to="/home">Health Care Center</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>

            {userRole === "patient" && (
              <>
                <Nav.Link as={Link} to="/covid-survey">Symptoms Checklist</Nav.Link>
                <Nav.Link as={Link} to="/createalert">Emergency Alert</Nav.Link>
              </>
            )}

            {userRole === "nurse" && (
              <>
                <Nav.Link as={Link} to="/home">View Patient Vitals</Nav.Link>
                <Nav.Link as={Link} to="/patient-alerts">Patient Alerts</Nav.Link>
                <Nav.Link as={Link} to="/create-daily-message">Create Daily Message</Nav.Link>
                <Nav.Link as={Link} to="/createvital">Create Vital</Nav.Link>
              </>
            )}
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/createuser">Sign Up</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/predict-disease">Disease Predictor</Nav.Link>
                <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="createuser" element={<CreateUser />} />
          <Route path="createvital" element={<CreateVital />} />
          <Route path="createalert" element={<CreateAlert />} />
          <Route path="/create-daily-message" element={<CreateDailyMotivation />} />
          <Route path="patient-alerts" element={<PatientAlerts />} />
          <Route path="covid-survey" element={<CovidSurvey />} />
          <Route path="predict-disease" element={<PredictDisease />} />
          <Route path="updatevital/:id" element={<UpdateVital />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;
