import {Component} from 'react'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {GoArrowLeft} from 'react-icons/go'
import CategoriesPodCast from '../CategoriesPodCast'

import Loading from '../Loading'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class CategoriesListDetails extends Component {
  state = {
    ActiveStatus: status.initial,
    podCast: [],
  }

  componentDidMount = () => {
    this.getApis()
  }

  getApis = async () => {
    try {
      const Token = Cookies.get('Token')
      this.setState({ActiveStatus: status.pending})
      const {match} = this.props
      const {params} = match
      const {id} = params

      const url = `https://apis2.ccbp.in/spotify-clone/category-playlists/${id}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }

      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        console.log(data)
        const updatedPodCast = data.playlists.items.map(each => ({
          name: each.name,
          image: each.images[0].url,
          total: each.tracks.total,
          id: each.id,
        }))
        this.setState({
          ActiveStatus: status.success,
          podCast: updatedPodCast,
        })
      } else if (response.status === 404) {
        this.setState({ActiveStatus: status.failed})
      }
    } catch (e) {
      this.setState({ActiveStatus: status.failed})
    }
  }

  tryAgain = () => {
    this.getApis()
  }

  goBack = () => {
    const {history} = this.props
    history.replace('/')
  }

  renderPending = () => (
    <>
      <Loading />
    </>
  )

  renderFailed = () => (
    <div className="main-container" style={{justifyContent: 'center'}}>
      <div className="error-flex">
        <img
          src="https://i.ibb.co/8m6mhJn/alert-triangle.png"
          alt="alert-triangle"
          className="triangle-image"
        />
        <p className="error-para">something went wrong</p>
        <button type="button" className="button" onClick={this.tryAgain}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderSuccess = () => {
    const {podCast} = this.state
    console.log(podCast)
    return (
      <div className="main-container">
        <nav className="nav-bar">
          <img
            src="https://i.ibb.co/tMjFXWf/music.png"
            alt="website logo"
            className="music-img"
          />
          <div className="flex">
            <GiHamburgerMenu style={{color: '#ffffff'}} />
          </div>
        </nav>
        <div
          className="back"
          data-testid="back"
          onClick={this.goBack}
          role="button"
          tabIndex={0}
        >
          <GoArrowLeft />
          <button
            type="button"
            style={{
              background: 'transparent',
              border: '0px solid',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        </div>
        <ul className="unordered-list">
          {podCast.map(each => (
            <CategoriesPodCast key={each.id} popular={each} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {ActiveStatus} = this.state
    console.log(ActiveStatus)
    let content
    switch (ActiveStatus) {
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

export default CategoriesListDetails
