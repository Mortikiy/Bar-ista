import React, { useState } from "react";
import "./styles.css";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
let bp = require('./Path.js');

function Login(props) 
{
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClick2 = () => {
    props.handleFunction2();
  };

  function verifyLogin()
  {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // eslint-disable-next-line
    let emailRestriction = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email == null || password == null || email == "" || password == "")
      return 0;

    else if (emailRestriction.test(email) == false)
      return 1;
    else
      return 200;

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const errmsg = document.getElementById('logInError');

    switch(verifyLogin())
        {
          case 0:
            {
              errmsg.innerHTML="Please enter all fields.";
              return;
            }
          case 1:
            {
              errmsg.innerHTML="Please enter a valid email address.";
              return;
            }
          case 200:
            {
              // Continue to fetch
              ;
            }
        }
    
    //https://obscure-springs-89188.herokuapp.com/api/login
    //http://localhost:5000/api/login
    fetch(bp.buildPath('api/login'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    })
      .then((response) =>
      {
        if (!response.ok)
        {
          throw new Error('Network error - response not OK');
        }
        return response.json();
      })
      .then((data) =>
      {
        if (data.error === ('no user found'))
        {
          errmsg.innerHTML="Incorrect or invalid combination.";
        }
          

        else if (data.error === ('please confirm email'))
        {
          errmsg.innerHTML="Please confirm your email to log in.";
        }

        // LOGGED IN
        else
        {
          localStorage.setItem('token', data);
          navigate("/home");
        }
          

        // Here is where we do something with the response data our call gives us (nothing for login besides a cookie maybe)
      })
      .catch((error) => 
      {
        console.error('Login request error:', error);
      });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
          </label>
          <input
            placeholder="Email"
            type="text"
            id="email"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group" id="labelpass" >
          <label htmlFor="password" className="form-label">
          </label>
          <input
            placeholder="Password"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-input"
          />
          <Link to="/forgot"><strong id="forgot" style={{textDecoration: "underline", display: "inline", cursor: "pointer"}}>Forgot?</strong></Link>
        </div>
        <button type="submit" className="form-button">
          Log in
        </button>
        <br></br>
        <p id="logInError"></p>
        <p>New here? <strong onClick={handleClick2} style={{textDecoration: "underline", display: "inline", cursor: "pointer"}}>Sign up!</strong></p>
      </form>
    </div>
  );
}

export default Login;