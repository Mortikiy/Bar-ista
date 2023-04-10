import React, { useEffect, useState } from 'react';
import HeartButton from './HeartButton';
import './cards.css';

function Card(props) {
  const { imageUrl, title, description, ingredients, savedDrinks } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDrinkSaved, setDrinkSaved] = useState(props.savedDrinks.includes(title));
  const [trigger, setTrigger] = useState(false); 
  const handleHeartClick = () => {
    setDrinkSaved(props.savedDrinks.includes(title));
  };

  useEffect(() => {
    
      props.grandParentFunction();
      setDrinkSaved(props.savedDrinks.includes(title));
  }, [props.savedDrinks]);

  return (
    <div className="card">
      <HeartButton isFilled={isDrinkSaved} onpress={handleHeartClick} name={title}/>
      <img src={imageUrl} alt={title} />
      <div className="card-data">
        <h2>{title}</h2>
        <ul className="description-list">
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Card;
