import React from 'react';
import { useState, useEffect } from "react";
import Card from '../components/Card.js';
import myImage from '../components/image.png';
import jwt_decode from 'jwt-decode';
import HeartButton from '../components/HeartButton';
import './favoritestyles.css';
let bp = require('../components/Path.js');

function Home()
{
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const decoded = jwt_decode(userToken);
    const [favoriteDrinks, setFavoriteDrinks] = useState([]);
    const [refresh, setRefresh] = useState(false);

    function refreshFavorites()
    {
        setRefresh(!(refresh));
    }

    function logOff()
    {
        localStorage.removeItem('token');
    }

    const [apiData, setApiData] = useState([]);
    useEffect(() =>
    {
        // code to run when component mounts
        const token = localStorage.getItem('token');
        // To login page if no token
        if (!token)
        {
            window.location.href = "/";
            return;
        }

        const userData = jwt_decode(token);
        let name = document.getElementById("greeting");
        name.innerHTML="Welcome to Barista, "+userData.firstName+"!";
        const userId = 
      {
        userId: userData._id
      }

        fetch(bp.buildPath('api/getRandomDrink'),
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then((response) =>
        {
            if (!response.ok)
            {
            throw new Error('Network error - response not OK');
            }
            return response.json();
        })
        .then(data => setApiData(data))
        .catch((error) => 
        {
            console.error('Login request error:', error);
        });
      }, []);
      

      useEffect(() =>
      {  
        const token = localStorage.getItem('token');
        const userData = jwt_decode(token);
        const userId = 
      {
        userId: userData._id
      }
        fetch(bp.buildPath('api/getFavorites'),
      {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userId),
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
        if (data.error == 'no user found')
        {
          setFavoriteDrinks(); // Show no favorites
        }
        else
        {
          setFavoriteDrinks([...data.map(item => item.name)]);
        }
      })
      .catch((error) => 
      {
          console.error(error);
      });
      
      }, [refresh]);

    return (
      <div>
      <nav className="navbar">
      <div className="navbar-left">
      <img src={myImage} alt="Logo" />
      <h1 id="greeting"></h1>
      </div>
      <div className="navbar-tabs">
      <a href="/favorites" className="tab-link">Favorites</a>
      <a href="/mybar" className="tab-link">MyBar</a>
      <a href="/" className="tab-link" onClick={logOff}>Logout</a>
      </div>
      </nav>
      <div className="page-container">
      <div className="card-header">
      <h1 className ="daily">Try these drinks!</h1>
      </div>

      <div className="card-container">
      {apiData.map(item => (
        <div className="drink">
        <Card
        imageUrl={item.img}
        title={item.name}
            ingredients={item.ingMeasurments}
            description={item.instructions}
            savedDrinks={favoriteDrinks}
            grandParentFunction={refreshFavorites}
            />
            </div>
            ))}
        </div>
      </div>
        </div>
    );
}

export default Home;
