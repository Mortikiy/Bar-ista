import React, { useState } from "react";
import "./styles.css";
function Signup() {
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Sign up API here

      fetch('https://obscure-springs-89188.herokuapp.com/api/createUser',
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
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
        if (data.error === ('user already exists'))
          alert('Error: User already exists!');
        else
          console.log('New account made! Hello, '+data.firstName+' '+data.lastName+'!');
      })
      .catch((error) => 
      {
        console.error('Signup request error:', error);
      });
    };
  
    return (
      <div className="form-container">
        <h1 className="form-title">Sign Up</h1>
        <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name:
            </label>
            <input
              placeholder="First Name"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(event) => setfirstName(event.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>
            <input
              placeholder="Last Name"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(event) => setlastName(event.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              placeholder="Email"
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password:
            </label>
            <input
              placeholder="Confirm Password"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-button">
            Submit
          </button>
          <br></br>
          <p>Returning? <div id="bold">Log in.</div></p>
        </form>
      </div>
    );
  }

export default Signup;
