import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./styles.css";
let bp = require('./Path.js');

function Signup(props) {
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setConfirm(!confirm);
    }
    const handleClick = () => {
      props.handleFunction();
    };

    function passwordVerification()
    {
      setConfirmPassword(document.getElementById('confirm-password').value);
      setPassword(document.getElementById('password').value);
      let msg = document.getElementById('confirmMessage');

      if (document.getElementById('confirm-password').value === "" || document.getElementById('password').value === "")
      {
        msg.innerHTML="";
        return;
      }

      if (passwordsMatch())
      {
        msg.innerHTML="Passwords match!";
        msg.style.color="green";
      }

      else
      {
        msg.innerHTML="Passwords do not match.";
        msg.style.color="red";
      }
      
    }

   function passwordsMatch()
   {
    let password = document.getElementById("password").value;
	  let confirm = document.getElementById("confirm-password").value;

    // Check if passwords match or empty
    return (confirm === password && confirm !== "") ? true : false;
   }

   function verifyInfo()
    {
      let firstName = document.getElementById('firstName').value;
      let lastName = document.getElementById('lastName').value;
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;

      // Disabling some goofy warnings for regex that react doesn't like

      // eslint-disable-next-line
	    let passRestriction = /(?=.*\d)(?=.*[A-Za-z])(?=.*[?!@#$%^&*]).{8,32}$/;
      // eslint-disable-next-line
	    let nameRestriction = /(?=.*[a-zA-Z])./;
      // eslint-disable-next-line
      let emailRestriction = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (nameRestriction.test(firstName) === false || nameRestriction.test(lastName) === false)
		    return 1;

      else if (emailRestriction.test(email) === false)
        return 2;

      else if (passRestriction.test(password) === false)
        return 3;

      if (!passwordsMatch())
        return 4;
      return 5;
    }

    const handleSubmit = (event) => {
      event.preventDefault();

      let signUpErrMsg = document.getElementById('signUpError');
      switch(verifyInfo())
      {
        case 1:
          {
            signUpErrMsg.innerHTML="Please enter a valid first/last name.";
            signUpErrMsg.style.color='red';
            return;
          }
        case 2:
          {
            signUpErrMsg.innerHTML="Please enter a valid email.";
            signUpErrMsg.style.color='red';
            return;
          }
        case 3:
          {
            signUpErrMsg.innerHTML="Your password must contain at least:<br>1 Uppercase & 1 Lowercase letter<br>1 Symbol & 1 Digit";
            signUpErrMsg.style.color='red';
            return;
          }
        case 4:
          {
            signUpErrMsg.innerHTML="Your passwords do not match.";
            signUpErrMsg.style.color='red';
            return;
          }
        case 5:
          {
            // Continue to fetch
            ;
          }
      }

      
      // Sign up API here
      //https://obscure-springs-89188.herokuapp.com/api/createUser
      //http://localhost:5000/api/createUser
      fetch(bp.buildPath('api/createUser'),
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
        {
          let signUpErrMsg = document.getElementById('signUpError');
          signUpErrMsg.innerHTML="User already exists with this email.";
          signUpErrMsg.style.color='red';
          return;
        }
        
        else
        {
          let signUpErrMsg = document.getElementById('signUpError');
          document.getElementById("signUpForm").querySelectorAll("input").forEach((input) => {
            input.value = "";
          setEmail('');
          setfirstName('');
          setlastName('');
          });


          passwordVerification();
          signUpErrMsg.innerHTML="New account made! Verification email sent.";
          signUpErrMsg.style.color='green';

        }
      })
      .catch((error) => 
      {
        console.error('Signup request error:', error);
      });
    };
  
    return (
      <div className="form-container">
        <h1 className="form-title">Sign Up</h1>
        <form onSubmit={handleSubmit} className="form" id="signUpForm">
        <div className="form-group">
            <label htmlFor="firstName" className="form-label">
            </label>
            <input
              name = "firstname"
              placeholder="First Name"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(event) => setfirstName(event.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
            </label>
            <input
              name = "lastname"
              placeholder="Last Name"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(event) => setlastName(event.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
            </label>
            <input
              name = "email"
              placeholder="Email"
              type="text"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
            </label>
            <input
              name = "password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={passwordVerification}
              className="form-input"
            />
            <i onClick={togglePasswordVisibility}>
            {showPassword ?  <FaEye /> : <FaEyeSlash />}
            </i>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
            </label>
            <input
              name = "confirm"
              placeholder="Confirm Password"
              type={confirm ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={passwordVerification}
              className="form-input"
            />
          <p id="confirmMessage"></p>
          </div>
          <button type="submit" className="form-button">
            Sign up!
          </button>
          <br></br>
          <p id="signUpError"></p>
          <p>Returning? <strong onClick={handleClick} style={{textDecoration: "underline", display: "inline", cursor: "pointer"}}>Log in.</strong></p>
        </form>
      </div>
    );
  }

export default Signup;
