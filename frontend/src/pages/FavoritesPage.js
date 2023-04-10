import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import "./favoritestyles.css";
import jwt_decode from 'jwt-decode';
import "../components/cards.css";
import myImage from '../components/image.png';
import HeartButton from '../components/HeartButton';
let bp = require('../components/Path.js');


function FavoritesPage() {
  const [list, setList] = useState(false);
  const [favoriteDrinks, setFavoriteDrinks] = useState([]);

  function refreshFavorites()
  {}
  
  function logOff()
  {
      localStorage.removeItem('token');
  }

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
            ; // Show no favorites
          }
        else
        {
          if (data.length == 0)
            setList(false);
          else
          {
            setList(true);
            setFavoriteDrinks(data);
          }
        }
      
      })
      .catch((error) => 
      {
          console.error(error);
      });

    }, [favoriteDrinks]);

  return (
    <div>
    <nav className="navbar">
    <div className="navbar-left">
        <img src={myImage} alt="Logo" />
        <h1 id="greeting">Favorites</h1>
    </div>
    <div className="navbar-tabs">
    <a href="/home">Daily Drinks</a>
    <a href="/favorites">Favorites</a>
    <a href="#">MyBar</a>
    <a href="/" onClick={logOff}>Logout</a>
    </div>
</nav>
    <div className="favorite-drinks">
      <div className="title-box"><h1>Favorite Drinks</h1></div>
      {list ?
      <div className="drink-list">
        {favoriteDrinks.map((drink, index) => (
          <div className="drink" key={drink.id}>
            <Card imageUrl={drink.img} title={drink.name} description={drink.instructions} ingredients={drink.ingMeasurments} savedDrinks={favoriteDrinks.map(item => item.name)} grandParentFunction={refreshFavorites}/>
          </div>
        ))}
      </div>
      : <div className="centered"><p>You have no favorites!</p><p>Open your bar to create and favorite drinks!</p></div>}
    </div>
    </div>
  );
}

export default FavoritesPage;