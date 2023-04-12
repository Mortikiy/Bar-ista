import { ReactComponent as HeartFilled } from './bxs-heart.svg';
import { ReactComponent as HeartOutline } from './bx-heart.svg';
import "./styles.css";
import jwt_decode from 'jwt-decode';
let bp = require('../components/Path.js');

function HeartButton(props) {
  const title = props.isFilled ? "Remove from favorites" : "Add to favorites"
  const heartIcon = props.isFilled ? <HeartFilled fill="#ff69b4" title={title} /> : <HeartOutline fill="#ff69b4" title={title} />;

  function handleClick()
  {
    const token = localStorage.getItem('token');

      // To login page if no token
      if (!token)
      {
          window.location.href = "/";
          return;
      }

      const userData = jwt_decode(token);
      const body = 
      {
        userId: userData._id,
        name: props.name
      }
    if (!props.isFilled)
    {
      fetch(bp.buildPath('api/addFavorite'),
      {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
      })
      .catch((error) => 
      {
          console.error(error);
      });
    }

    else
    {
      fetch(bp.buildPath('api/deleteFavorite'),
      {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
      })
      .catch((error) => 
      {
          console.error(error);
      });
    }
    props.onpress();
  }

  return (
    <button style={{background: 'none', border: 'none', padding: '0', marginTop: '-10px', marginLeft: '0px', marginRight: '-10px', cursor: 'pointer'}} onClick={handleClick}>
      {heartIcon}
    </button>
  );
}

export default HeartButton;
