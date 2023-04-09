import { ReactComponent as HeartFilled } from './bxs-heart.svg';
import { ReactComponent as HeartOutline } from './bx-heart.svg';
import "./styles.css";
function HeartButton({ isFilled, onClick }) {
  const title = isFilled ? "Remove from favorites" : "Add to favorites"
  const heartIcon = isFilled ? <HeartFilled fill="#ff69b4" title={title} /> : <HeartOutline fill="#ff69b4" title={title} />;
  return (
    <button style={{background: 'none', border: 'none', padding: '0', cursor: 'pointer', marginTop: '10px'}} onClick={onClick}>
      {heartIcon}
    </button>
  );
}

export default HeartButton;
