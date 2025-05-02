// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
    similarProducts: [],
  }

  componentDidMount() {
    this.getProductsData()
  }

  getFormattedData = data => ({
    id: data.id,
    description: data.description,
    title: data.title,
    rating: data.rating,
    brand: data.brand,
    imageUrl: data.image_url,
    totalReviews: data.total_reviews,
    availability: data.availability,
    price: data.price,
  })

  getProductsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachProduct => this.getFormattedData(eachProduct),
      )
      this.setState({
        productData: updatedData,
        similarProducts: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-element" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductViewDetailed = () => {
    const {productData, quantity, similarProducts} = this.state
    const {
      availability,
      price,
      title,
      brand,
      imageUrl,
      description,
      rating,
      totalReviews,
    } = productData

    return (
      <div className="product-container">
        <div className="products-data-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div>
            <h1>{title}</h1>
            <p>Rs {price}</p>
            <div>
              <div>
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p>{totalReviews} reviews</p>
            </div>
            <p>{description}</p>
            <div>
              <p>Availability:</p>
              <p>{availability}</p>
            </div>
            <div>
              <p>Brand</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div>
              <button
                type="button"
                data-testid="minus"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                data-testid="plus"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="unordered-list-similar-products">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              productDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductViewDetailed()
      case apiStatusConstants.failure:
        return this.getFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="bg-container">{this.renderProductView()}</div>
      </>
    )
  }
}

export default ProductItemDetails
