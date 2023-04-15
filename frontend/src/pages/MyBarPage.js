import React, { useState, useEffect } from "react";
import "./mybarstyles.css";
import myImage from '../components/image.png';
import jwt_decode from 'jwt-decode';
import Card from '../components/Card';
let bp = require('../components/Path.js');

const MyBarPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [myBar, setMyBar] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("");
  const [drinks, setDrinks] = useState([]);
  const [favoriteDrinks, setFavoriteDrinks] = useState([]);

  function refreshFavorites()
  {}

  const getIngredients = async () => {
    fetch(bp.buildPath('api/getIngredients'),
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
    .then((data) => 
    {
        const sortedData = data.sort((a, b) => {
            if (a.ingredient < b.ingredient) return -1;
            if (a.ingredient > b.ingredient) return 1;
            return 0;
          });
          setIngredients(sortedData);
    })
    .catch((error) => 
    {
        console.error(error);
    });
  };

  const getFavorites = async () =>
  {
    const id = jwt_decode(localStorage.getItem('token'))._id;
    const userId = 
    {
        userId: id
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
        setFavoriteDrinks(data);      
      })
      .catch((error) => 
      {
          console.error(error);
      });
  }

  const getDrinks = async () =>
  {
    const id = jwt_decode(localStorage.getItem('token'))._id;
    const userId = 
    {
        userId: id
    }

    fetch(bp.buildPath('api/getDrinks'),
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
        const sortedData = data.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          setDrinks([...sortedData]);
    })
    .catch((error) => 
    {
        console.error(error);
    });
  }

  function logOff()
  {
      localStorage.removeItem('token');
  }

  useEffect(() =>
  {
    const token = localStorage.getItem('token');

      // To login page if no token
      if (!token)
      {
          window.location.href = "/";
          return;
      }
    getIngredients();
    setRefresh(!refresh);
    getDrinks();
    getFavorites();
  }, [favoriteDrinks]);

  useEffect(() =>
  {
    const id = jwt_decode(localStorage.getItem('token'))._id;
    const userId = 
    {
        userId: id
    }
    fetch(bp.buildPath('api/getBar'),
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
        const sortedData = data.sort((a, b) => {
            if (a.ingredient < b.ingredient) return -1;
            if (a.ingredient > b.ingredient) return 1;
            return 0;
          });

        setMyBar([...sortedData]);
    })
    .catch((error) => 
    {
        console.error(error);
    });
    
  }, [refresh]);

  const handleInputChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const handleRemove = (ingredient) => {
    const id = jwt_decode(localStorage.getItem('token'))._id;
            const userId = 
            {
                userId: id,
                ingName: ingredient.ingredient
            } 

            fetch(bp.buildPath('api/deleteIngredientInBar'),
            {
            method: 'DELETE',
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
            .then(() => 
            {
                setRefresh(!refresh);
            })
            .catch((error) => 
            {
                console.error(error);
            });
  };

  const handleFilter = (type) => {
    setFilter(type.toLowerCase());
  };

  const getDrinkColor = (drinkType) => {
    switch (drinkType.toLowerCase()) {
      case "mixer":
        return "#FFD700"; // bright yellow
      case "juice":
        return "#ff9736"; // bright orange
      case "syrup":
        return "lime"; // bright blue
      case "liqueur":
        return "#aaffc3"; // bright green
      case "spirit":
        return "#f736f4"; // bright purple
      case "bitters":
        return "#FF84B8"; // bright pink
      case "vermouth":
        return "#ff7577"; // bright coral
      default:
        return "#c1c1c1"; // bright gray
    }
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
  ingredient.type.toLowerCase().includes(filter) ||
  ingredient.ingredient.toLowerCase().includes(filter)
).sort();

  const filteredTypes = [
    "mixer",
    "juice",
    "syrup",
    "liqueur",
    "spirit",
    "bitters",
    "vermouth",
    "other",
  ].filter((type) => type.toLowerCase().includes(filter));

  const ingredientList = filteredIngredients.map((ingredient) => (
    <div
      key={ingredient}
      className="ingredient-item"
      onClick={() => {
        if (!myBar.includes(ingredient)) {
            const id = jwt_decode(localStorage.getItem('token'))._id;
            const userId = 
            {
                userId: id,
                ingName: ingredient.ingredient
            } 

            fetch(bp.buildPath('api/addIngredientToBar'),
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
            .then(() => 
            {
                setRefresh(!refresh);
            })
            .catch((error) => 
            {
                console.error(error);
            });
        }        
      }}
      style={{ backgroundColor: getDrinkColor(ingredient.type) }}
    >
      {ingredient.ingredient.charAt(0).toUpperCase() + ingredient.ingredient.slice(1)}
    </div>
  ));

  const typeTabs = filteredTypes.map((type) => (
    <span
      key={type}
      onClick={() => handleFilter(type)}
      style={{ backgroundColor: getDrinkColor(type) }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  ));

  return (
    <div>
    <nav className="navbar">
        <div className="navbar-left">
            <img src={myImage} alt="Logo" />
            <h1 id="greeting">MyBar</h1>
        </div>
        <div className="navbar-tabs">
            <a href="/home" className="tab-link">Daily Drinks</a>
            <a href="/favorites" className="tab-link">Favorites</a>
            <a href="/mybar" className="tab-link">MyBar</a>
            <a href="/" className="tab-link" onClick={logOff}>Logout</a>
        </div>
    </nav>
    <div className="mybar-page">
        <div className="ingredients">
            <div className="title_box"><h2>Ingredients</h2></div>
                <div className="search">
                    <input
                    type="text"
                    placeholder="Search"
                    onChange={handleInputChange}
                    />
                </div>
            <div className="filters">
                <span onClick={() => handleFilter("")}>All</span>
                {typeTabs}
            </div>
            <div className="ingredient-list" title={'Add Ingredient'}>{ingredientList}</div>
            {drinks.length > 0 ? <div><div className="title_box"><h2>Craftable Drinks</h2></div>
      <div className="drink-list">
        {drinks.map((drink, index) => (
          <div className="drink" key={drink.id}>
            <Card imageUrl={drink.img} title={drink.name} description={drink.instructions} ingredients={drink.ingMeasurments} savedDrinks={favoriteDrinks.map(item => item.name)} grandParentFunction={refreshFavorites}/>
          </div>
        ))}
      </div>
      </div>
      : <div><h2>Craftable Drinks</h2><div className="centered"><p style={{fontWeight: "bold"}}>No craftable drinks! Add some more ingredients!</p></div></div>}
        </div>
        <div className="mybar">
        <div className="title_box"><h2>My Bar</h2></div>
                <div className="ingredient-list">
                    {myBar.length > 0 ?
                    myBar.map((ingredient) => (
                        <div key={ingredient.ingredient} className="ingredient-item" style={{backgroundColor: getDrinkColor(ingredient.type), cursor: 'default', color: "black"}}>
                            <span
                            style={{
                            backgroundColor: getDrinkColor(ingredient.type),
                            color: "black",
                            borderRadius: "4px",
                            padding: "4px",
                            marginRight: "4px",
                            textTransform: "capitalize",
                            cursor: 'default',
                            }}
                            >
                                {ingredient.type}
                            </span>
                            <span style={{cursor: 'default'}}>
                                {ingredient.ingredient.charAt(0).toUpperCase() + ingredient.ingredient.slice(1)}
                            </span>
                            <button id = "x" style={{color: "black"}} title={'Remove from bar'} onClick={() => handleRemove(ingredient)}>X</button>
                        </div>
                    )) : <div style={{textAlign: 'center', fontWeight: "bold", fontSize: '1.3em', color: "white"}}>You have no ingredients added to your bar!</div>}
                </div>
        </div>
    </div>
    </div>
    );
}
    
    export default MyBarPage;
