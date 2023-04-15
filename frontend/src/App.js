import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" index element={<LoginPage/>} />
      <Route path="/forgot" index element={<ForgotPassword/>} />
      <Route path="/reset-password/*" index element ={<ResetPassword/>} />
      <Route exact path="/home" index element = {<Home />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;
