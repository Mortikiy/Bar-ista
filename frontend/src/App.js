import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" index element={<LoginPage/>} />
      <Route path="/forgot" index element={<ForgotPassword/>} />
    </Routes>
  </BrowserRouter>

);
}

export default App;
