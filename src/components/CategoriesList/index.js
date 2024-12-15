import {Component} from 'react'
import Cookies from 'js-cookie'
import Loading from '../Loading'
import CategoriesApi from '../CategoriesApi'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class CategoriesList extends Component {
  state = {activeStatus: status.initial, thumbnails: []}

  componentDidMount = () => {
    this.getAlls()
  }

  getAlls = async () => {
    const Token = Cookies.get('jwt_token')
    try {
      this.setState({activeStatus: status.pending})
      const url = 'https://apis2.ccbp.in/spotify-clone/categories'
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        const updatedResponse = data.categories.items.map(each => ({
          id: each.id,
          image: each.icons[0].url,
          name: each.name,
        }))
        this.setState({
          thumbnails: updatedResponse,

          activeStatus: status.success,
        })
      } else if (response.status === 404) {
        this.setState({activeStatus: status.failed})
      }
    } catch (error) {
      console.log('Network or other error:', error)
      this.setState({activeStatus: status.failed})
    }
  }

  tryAgainOne = () => {
    this.getAlls()
  }

  renderPending = () => <Loading />

  renderFailed = () => (
    <div className="main-container">
      <h1 className="heading">Genres & Moods</h1>
      <div className="error-flex" style={{paddingTop: '34px'}}>
        <img
          src="https://i.ibb.co/8m6mhJn/alert-triangle.png"
          alt="failure view"
          className="triangle-image"
        />
        <p className="error-para">Something went wrong. Please try again</p>
        <button type="button" className="button" onClick={this.tryAgainOne}>
          Try again
        </button>
      </div>
    </div>
  )

  renderSuccess = () => {
    const {thumbnails} = this.state

    return (
      <div className="main-container">
        <h1 className="heading">Genres & Moods</h1>
        <ul className="unordered-list">
          {thumbnails.map(each => (
            <CategoriesApi key={each.id} popular={each} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {activeStatus} = this.state

    let content

    switch (activeStatus) {
      case status.pending:
        content = this.renderPending()
        break
      case status.failed:
        content = this.renderFailed()
        break
      case status.success:
        content = this.renderSuccess()
        break
      default:
        break
    }

    return <>{content}</>
  }
}

export default CategoriesList
