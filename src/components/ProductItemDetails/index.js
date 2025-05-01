// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiStatusView = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productList: {},
    apiStatus: apiStatusView.initial,
    quantity: 1,
    similarProducts: [],
  }

  componentDidMount() {
    this.getProducts()
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

  getProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusView.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `https://localhost:3000/products/${id}`,
      options,
    )
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachProduct => this.getFormattedData(eachProduct),
      )
      this.setState({
        similarProducts: updatedSimilarProductsData,
        productList: updatedData,
        apiStatus: apiStatusView.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusView.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <p>Products Not Found</p>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
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
    const {productList, quantity, similarProducts} = this.state
    const {
      availability,
      price,
      title,
      brand,
      imageUrl,
      description,
      rating,
      totalReviews,
    } = productList

    return (
      <div>
        <div>
          <img src={imageUrl} alt="product" />
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
        <h1>Similar PRoducts</h1>
        <ul>
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
      case apiStatusView.success:
        return this.renderProductViewDetailed()
      case apiStatusView.failure:
        return this.getFailureView()
      case apiStatusView.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductView()}</div>
      </>
    )
  }
}

export default ProductItemDetails
