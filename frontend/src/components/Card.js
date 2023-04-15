import React from 'react';
import "./cards.css";

function Card(props)
{
  const {imageUrl, title, description, ingredients} = props;

  return (
    <div className="card">
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
