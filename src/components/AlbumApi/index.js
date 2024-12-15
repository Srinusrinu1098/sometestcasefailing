import {Link} from 'react-router-dom'
import './AlbumApi.css'

const AlbumApi = props => {
  const {popular} = props
  const {image, id, name, text} = popular
  return (
    <Link to={`/album/${id}`} style={{textDecoration: 'none'}}>
      <li className="image-container">
        <img className="image" src={image} alt="new release album" />
        <p className="text1">{name}</p>
        <p className="text">{text}</p>
      </li>
    </Link>
  )
}

export default AlbumApi
