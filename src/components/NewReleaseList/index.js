import {Component} from 'react'
import Cookies from 'js-cookie'
import Loading from '../Loading'
import AlbumApi from '../AlbumApi'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class NewReleaseList extends Component {
  state = {activeStatus: status.initial, thumbnails: []}

  componentDidMount = () => {
    this.getAllsOne()
  }

  getAllsOne = async () => {
    const Token = Cookies.get('jwt_token')
    try {
      this.setState({activeStatus: status.pending})
      const url = 'https://apis2.ccbp.in/spotify-clone/new-releases'
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        const updatedResponse = data.albums.items.map(each => ({
          id: each.id,
          image: each.images[0].url,
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
    this.getAllsOne()
  }

  renderPending = () => <Loading />

  renderFailed = () => (
    <div>
      <h1 className="heading">New Releases</h1>
      <div className="error-flex" style={{paddingTop: '34px'}}>
        <img
          src="https://i.ibb.co/8m6mhJn/alert-triangle.png"
          alt="failure view"
          className="triangle-image"
        />
        <p className="error-para">Something went wrong. Please try again</p>
        <button type="button" className="button" onClick={this.tryAgainOne}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderSuccess = () => {
    const {thumbnails} = this.state

    return (
      <div>
        <h1 className="heading">New Releases</h1>
        <ul className="unordered-list">
          {thumbnails.map(each => (
            <AlbumApi key={each.id} popular={each} />
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

export default NewReleaseList
