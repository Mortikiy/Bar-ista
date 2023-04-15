import React, { useState } from "react";
import '../components/styles.css';
import Login from '../components/Login';
import Signup from '../components/Signup';
import myImage from '../components/image.png';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const handleFunction = () => {
    setIsLogin(true);
    let myClass = document.getElementById("signUpButton");
    myClass.className="";
    let mySecondClass = document.getElementById("logInButton");
    mySecondClass.className="form-switch-button-active";
  };

  const handleFunction2 = () => {
    setIsLogin(false);
    let myClass = document.getElementById("logInButton");
    myClass.className="";
    let mySecondClass = document.getElementById("signUpButton");
    mySecondClass.className="form-switch-button-active";
  };

return (
    <div className="app-container">
      <div className="neon-logo">
        B a r i s t a
      </div>
      <img src={myImage} className="beer-image" alt="Beer" />
      <div className="form-switch-container">
        <button
          id="logInButton"
          onClick={() => setIsLogin(true)}
          className={`form-switch-button ${
            isLogin ? "form-switch-button-active" : ""
          }`}
        >
          Login
        </button>
        <button
          id="signUpButton"
          onClick={() => setIsLogin(false)}
          className={`form-switch-button ${
            !isLogin ? "form-switch-button-active" : ""
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="form-and-image">
        {isLogin ? (
          <Login handleFunction2={handleFunction2} />
        ) : (
          <Signup handleFunction={handleFunction} />
        )}
  </div>
  </div>
);
}

export default LoginPage;