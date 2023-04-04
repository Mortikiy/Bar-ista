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
      <h1 style={{paddingBottom: 10, marginTop: '-1.7%'}}>Welcome to Bar-ista!</h1>
      <div className="form-switch-container"
       style={{backgroundColor: 'black', borderRadius: '10px'}}
      >
        <button
          id = "logInButton"
          onClick={() => setIsLogin(true)}
          className={`form-switch-button ${
            isLogin ? "form-switch-button-active" : ""
          }`}
        >
          Login
        </button>
        <button
          id = "signUpButton"
          onClick={() => setIsLogin(false)}
          className={`form-switch-button ${
            !isLogin ? "form-switch-button-active" : ""
          }`}
        >
          Sign Up
        </button>
      </div>
      <div style={{display: 'flex', alignItems: 'center', marginLeft: '12vw'}}>
      {isLogin ? <Login handleFunction2={handleFunction2}/> : <Signup handleFunction={handleFunction} />}
      <img src={myImage} style={{width: '20%', height: '40%', padding: 10, postion: 'relative', display: 'inline'}} alt="Logo" />
      </div>
    </div>
  );
}

export default LoginPage;