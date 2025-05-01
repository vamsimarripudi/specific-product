// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, rating, imageUrl, price} = productDetails

  return (
    <li>
      <img src={imageUrl} alt={`similar product ${title}`} />
      <p>{title}</p>
      <p>by{brand}</p>

      <div>
        <p>Rs {price}</p>
        <div>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
