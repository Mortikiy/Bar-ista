import React, { useState } from "react";
import '../components/styles.css';
import Login from '../components/Login';
import Signup from '../components/Signup';
import '../components/image.png';
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="app-container">
      <h1>Welcome to AppName!</h1>
      <br></br>
      <img src='image.png' alt="Beer"/>
      <br></br>
      <div className="form-switch-container">
        <button
          onClick={() => setIsLogin(true)}
          className={`form-switch-button ${
            isLogin ? "form-switch-button-active" : ""
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`form-switch-button ${
            !isLogin ? "form-switch-button-active" : ""
          }`}
        >
          Sign Up
        </button>
      </div>
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
}

export default LoginPage;