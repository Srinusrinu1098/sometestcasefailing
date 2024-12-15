import {Link} from 'react-router-dom'
import './CategoriesApi.css'

const CategoriesApi = props => {
  const {popular} = props
  const {image, id, name, text} = popular
  return (
    <Link to={`/category/${id}/playlists`} style={{textDecoration: 'none'}}>
      <li className="image-container">
        <img className="image" src={image} alt="category" />
        <p className="text1">{name}</p>
        <p className="text">{text}</p>
      </li>
    </Link>
  )
}

export default CategoriesApi
