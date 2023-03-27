import React, { useState } from 'react';
import './forgotStyles.css';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  function verifyEmail()
  {
    let emailRestriction = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (document.getElementById("resetEmail").value === "")
      return 1;
    else if (emailRestriction.test(document.getElementById("resetEmail").value) === false)
      return 2;
    else
      return 3;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let msg = document.getElementById("resetErr");
    switch(verifyEmail())
    {
      case 1:
        {
          msg.innerHTML="Please enter all fields.";
          msg.style.color="red";
          return;
        }
        case 2:
        {
          msg.innerHTML="Please enter a valid email address.";
          msg.style.color="red";
          return;
        }
        default:
        {
          ; // Proceed to FETCH
        }
    }
    console.log(`Password reset requested for email: ${email}`);
    setEmail('');
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h1 className="forgot-password-title">Forgot Password?</h1>
        <div id = "wrapper">
          <label className="forgot-password-label">Enter email:</label>
          <input id ="resetEmail" className="forgot-password-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <p id="resetErr"></p>
        <br></br>
        <button className="forgot-password-button" type="submit">Reset Password</button>
        <br></br>
        <Link to="/"><strong id="back" style={{textDecoration: "underline", display: "inline", cursor: "pointer"}}>Go back</strong></Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
