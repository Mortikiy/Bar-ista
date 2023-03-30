import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './forgotStyles.css';
let bp = require('../components/Path.js');
const jwt = require('jsonwebtoken');

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [match, setMatch] = useState('');
  
  const [messageColor, setMessageColor] = useState('');
  const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
  setConfirm(!confirm);
  }

  function passwordCheck()
  {
    setPassword(document.getElementById('resetPassword').value);
    setConfirmPassword(document.getElementById('confirmResetPassword').value);

    if (document.getElementById('resetPassword').value === "" || document.getElementById('confirmResetPassword').value === "")
    {
        setMatch("");
        setMessageColor("");
    }

    else if (document.getElementById('resetPassword').value === document.getElementById('confirmResetPassword').value)
    {
        setMatch("Passwords match!");
        setMessageColor("green");
    }
        
    else
    {
        setMatch("Passwords do not match!");
        setMessageColor("red");
    }
        
  }

  function verifyPassword()
    {
      let passwordRestriction = /(?=.*\d)(?=.*[A-Za-z])(?=.*[?!@#$%^&*]).{8,32}$/;
  
      if (password === "" || confirmPassword ==="")
        return 1;
      else if (passwordRestriction.test(password) === false)
        return 2;
      else if (password !== confirmPassword)
        return 3;
      else
        return 4;
    }

  const handleSubmit = (e) => {
    e.preventDefault();

    switch(verifyPassword())
    {
      case 1:
        {
          setMessage("Please enter all fields.");
          setColor('red');
          return;
        }
        case 2:
        {
          setMessage("Your password must contain at least:\n1 Uppercase & 1 Lowercase letter\n1 Symbol & 1 Digit");
          setColor('red');
          return;
        }

        case 3:
        {
          setMessage("Passwords do not match!");
          setColor('red');
          return;
        }

        default:
        {
          ; // Continue to FETCH
        }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('emailToken');
    let userId = jwt.verify(userID, process.env.SECRET_TOKEN).id;
    
    fetch(bp.buildPath('api/resetPassword'),
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, password}),
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
        {
          setMessage("Password successfully changed!");
          setColor("green");
        }
      })
      .catch((error) => 
      {
        console.error('Change password error:', error);
      });

  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h1 className="forgot-password-title">Reset Password</h1>
        <div id = "wrapper">
          <label className="forgot-password-label">New password:</label>
          <input id ="resetPassword" className="forgot-password-input" type={confirm ? "text" : "password"} value={password} onChange={passwordCheck} placeholder="New password" />
          <i style={{
                        position:"absolute",
                        backgroundColor:"transparent",
                        border: "none",
                        cursor: "pointer",
                        transform: "translateX(-160%)",
                        paddingTop: "25px",
                   }}
            onClick={togglePasswordVisibility}>
            {showPassword ?  <FaEye /> : <FaEyeSlash />}
            </i>
          <label className="forgot-password-label">Confirm new password:</label>
          <input style = {{marginBottom: "0px"}} id ="confirmResetPassword" className="forgot-password-input" type={confirm ? "text" : "password"} value={confirmPassword} onChange={passwordCheck} placeholder="Confirm new password" />
          <span style={{color: messageColor, paddingBottom: "8px", paddingTop: "5px", float: "right"}}>{match}</span>
        </div>
        <button className="forgot-password-button" type="submit" style={{marginTop: "10px"}}>Change Password</button>
        <span style={{color: color, whiteSpace: 'pre-line', paddingTop: "12px"}}>{message}</span>
      </form>
    </div>
  );
};

export default ResetPassword;
