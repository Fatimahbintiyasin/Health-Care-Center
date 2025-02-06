/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//
import { useNavigate } from 'react-router-dom';

import "./entryform.css"


const CreateUser = () => {

    const [createUserStatus, setCreateUserStatus] = useState('');
    let navigate = useNavigate()

    async function handleCreateUser(userName, email, password, role) {
      if (!role) {
        setCreateUserStatus('Role is required');
        return;
      }
        try {
          const response = await fetch('http://localhost:3000/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, email, password, role }),
          });
          const data = await response.text();
          setCreateUserStatus(data)
          window.location.href = '/home';
        } catch (error) {
          console.error('Error logging in:', error);
          setCreateUserStatus('Error creating user');
        }
      }

    return (
      <div className='mt-3'>
        <div className='container'>
          <form onSubmit={(e) => {
              e.preventDefault();
              const userName = e.target.userName.value;
              const email = e.target.email.value;
              const password = e.target.password.value;
              const role = e.target.role.value;
              handleCreateUser(userName, email, password, role);
          }}>

                      <Form.Group>
                          <Form.Label> Name:</Form.Label>
                          <Form.Control type="text" id="userName" name="userName" />
                      </Form.Group>                   
                
                      <Form.Group>
                          <Form.Label> Email:</Form.Label>
                          <Form.Control type="text" id="email"  name="email"/>
                      </Form.Group>                     

                      <Form.Group>
                          <Form.Label> Password:</Form.Label>
                          <Form.Control type="password" id="password" name="password"/>
                      </Form.Group>    

            <Form.Group>
              <Form.Label>User Role: </Form.Label>
              <Form.Control as="select" id="role" name="role" required>
                <option value="patient">Patient</option>
                <option value="nurse">Nurse</option>
              </Form.Control>
            </Form.Group>              

                      <Button className='mt-3' variant="primary" type="submit"> Create User </Button>

          </form>
        </div>
      </div>
    );
}
//
export default CreateUser
