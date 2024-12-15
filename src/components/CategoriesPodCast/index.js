const CategoriesPodCast = props => {
  const {popular} = props
  const {image, name, total} = popular
  return (
    <li className="image-container">
      <img className="image" src={image} alt="featured playlist" />
      <p className="text1">{name}</p>
      <p className="text">{total} tracks</p>
    </li>
  )
}

export default CategoriesPodCast
