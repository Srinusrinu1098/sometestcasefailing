import {Link} from 'react-router-dom'
import './PopularStyle.css'

const PopularList = props => {
  const {popular} = props
  const {image, id, name, text} = popular
  return (
    <Link to={`/playlist/${id}`} style={{textDecoration: 'none'}}>
      <li className="image-container">
        <img className="image" src={image} alt="featured playlist" />
        <p className="text1">{name}</p>
        <p className="text">{text}</p>
      </li>
    </Link>
  )
}

export default PopularList
