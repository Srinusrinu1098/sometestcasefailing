import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import './HomeStyle.css'
import Loading from '../Loading'
import PopularList from '../PopularList'
import CategoriesList from '../CategoriesList'
import NewReleaseList from '../NewReleaseList'
import MediaPlayer from '../MediaPlayer'
import SongContexts from '../../SongContext/SongContexts'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Home extends Component {
  state = {activeStatus: status.initial, thumbnails: []}

  componentDidMount = () => {
    this.getAll()
  }

  getAll = async () => {
    const Token = Cookies.get('jwt_token')
    try {
      this.setState({activeStatus: status.pending})
      const url = 'https://apis2.ccbp.in/spotify-clone/featured-playlists'
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
        const updatedResponse = data.playlists.items.map(each => ({
          id: each.id,
          text: each.description,
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
      this.setState({activeStatus: status.failed})
    }
  }

  tryAgain = () => {
    this.getAll()
  }

  renderPending = () => <Loading />

  renderFailed = () => (
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
      <h1 className="heading">Popular Playlists</h1>
      <div className="error-flex">
        <img
          src="https://i.ibb.co/8m6mhJn/alert-triangle.png"
          alt="failure view"
          className="triangle-image"
        />
        <p className="error-para">Something went wrong. Please try again</p>
        <button type="button" className="button" onClick={this.tryAgain}>
          Try again
        </button>
      </div>
      <CategoriesList />
      <NewReleaseList />
    </div>
  )

  renderSuccess = ActiveSong => {
    const {thumbnails} = this.state

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
        <h5 className="heading">Editors Picks</h5>

        <ul className="unordered-list">
          {thumbnails.map(each => (
            <PopularList key={each.id} popular={each} />
          ))}
        </ul>
        <CategoriesList />
        <NewReleaseList />
        {ActiveSong && <MediaPlayer />}
      </div>
    )
  }

  render() {
    const {activeStatus} = this.state
    let content
    const Token = Cookies.get('jwt_token')
    if (Token === undefined) {
      return <Redirect to="/login" />
    }

    switch (activeStatus) {
      case status.pending:
        content = this.renderPending()
        break
      case status.failed:
        content = this.renderFailed()
        break
      case status.success:
        content = (
          <SongContexts.Consumer>
            {contextValue => this.renderSuccess(contextValue.ActiveSong)}
          </SongContexts.Consumer>
        )
        break
      default:
        break
    }

    return <>{content}</>
  }
}

export default Home
