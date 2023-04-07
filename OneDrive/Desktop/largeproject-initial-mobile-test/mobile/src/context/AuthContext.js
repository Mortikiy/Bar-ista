import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const AuthContext = createContext();
import jwt_decode from 'jwt-decode';

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = (login, password) => {
    setIsLoading(true);
    axios.post('https://obscure-springs-89188.herokuapp.com/api/login', 
      {login: login , password: password })
    .then (res => {
      if (res.data.error === "no user found") {
        alert("No user found");
        setIsLoading(false);
      } else if (res.data.error === "please confirm email"){
        alert("Please Confirm your email to log in");
        setIsLoading(false);
      } else {
        let userToken = JSON.stringify(res.data);
        console.log("res is" + JSON.stringify(res.data));
        setUserToken(userToken);
        AsyncStorage.setItem('userToken', userToken);
        setIsLoading(false);
      }
    })
    .catch(e => {
      console.log('login error ${e}');
    });
  }

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  }

  const isLoggedIn = async() => {
    try{
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      if(userToken){
        setUserToken(userToken);
      }
      
      setIsLoading(false);
    } catch (e) {
      console.log('isLogged in error ${e}')
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, [])

  return (
    <AuthContext.Provider value = {{login, logout, isLoading, userToken}}>
      {children}
    </AuthContext.Provider>
  )
}