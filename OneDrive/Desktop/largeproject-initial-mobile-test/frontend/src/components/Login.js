import React, { useState } from "react";
import "./styles.css";

function Login() 
{
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('https://obscure-springs-89188.herokuapp.com/api/login',
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
          alert('No user found');
        else
        {
          console.log(data);
          alert('Hello, '+data.firstName+' '+data.lastName+'!');
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
          Email:
          </label>
          <input
            placeholder="Email:"
            type="email"
            id="email"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            placeholder="Password"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Submit
        </button>
        <br></br>
        <p>New here? <div id="bold">Sign Up.</div></p>
      </form>
    </div>
  );
}

export default Login;
