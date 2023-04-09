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
        name.innerHTML="Welcome to Bar-ista, "+userData.firstName+"!";

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
    


    return (
        <div>
        <nav className="navbar">
            <div className="navbar-left">
                <img src={myImage} alt="Logo" />
                <h1 id="greeting"></h1>
            </div>
            <div className="navbar-tabs">
            <a href="/home">Daily Drinks</a>
            <a href="/favorites">Favorites</a>
            <a href="#">MyBar</a>
            <a href="/" onClick={logOff}>Logout</a>
            </div>
        </nav>
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
            />
            </div>
            ))}
        </div>
        </div>
    );
}

export default Home;