import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" index element={<LoginPage/>} />
      <Route exact path="/forgot" index element={<ForgotPassword/>} />
      <Route exact path="/reset-password/:token" index element ={<ResetPassword/>} />
    </Routes>
  </BrowserRouter>
);
}

export default App;
