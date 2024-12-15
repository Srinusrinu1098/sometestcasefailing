import {Component} from 'react'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {GoArrowLeft} from 'react-icons/go'
import SmallDeviceDetails from '../SmallDeviceDetails'
import MediaPlayer from '../MediaPlayer'
import SongContexts from '../../SongContext/SongContexts'
import LargeDeviceDetails from '../LargeDeviceDetails'
import Loading from '../Loading'
import './PlayList.css'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class PlayListDetails extends Component {
  state = {
    ActiveStatus: status.initial,
    banner: '',
    name: '',
    description: '',
    smallDetails: [],
    newValue: false,
    total: '',
  }

  componentDidMount = () => {
    this.getApis()
  }

  componentDidUpdate(prevProps, prevState) {
    const {newValue} = this.state
    if (newValue !== prevState.newValue) {
      this.setState({newValue})
    }
  }

  getApis = async () => {
    try {
      const Token = Cookies.get('Token')
      this.setState({ActiveStatus: status.pending})
      const {match} = this.props
      const {params} = match
      const {id} = params

      const url = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`
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
        this.setState({
          name: data.name,
          banner: data.images[0].url,
          description: data.description,
          total: data.tracks.total,
        })
        const updated = data.tracks.items.map(each => ({
          songName: each.track.name,
          song: each.track.preview_url,
          album: each.track.album.artists[0].name,
          duration: each.track.duration_ms,
          artist: each.track.artists[0].name,
          id: each.track.id,
          addedAt: each.added_at,
        }))

        this.setState({
          ActiveStatus: status.success,
          smallDetails: updated,
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
    const {banner, name, description, smallDetails} = this.state
    console.log(smallDetails)

    return (
      <SongContexts.Consumer>
        {contextValue => {
          const {ActiveSong} = contextValue
          const {newValue, total} = this.state

          if (ActiveSong !== newValue) {
            this.setState({newValue: ActiveSong})
          }

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
              <div className="banner">
                <img
                  src={banner}
                  alt="featured playlist"
                  className="banner-img"
                />
                <div className="name-para">
                  <h5 className="name-heading">{total}</h5>
                  <h1 className="name-heading">{name}</h1>
                  <p className="name-para">{description}</p>
                </div>
              </div>
              <div className="small">
                <ul className="smallUl">
                  {smallDetails.map(each => (
                    <SmallDeviceDetails key={each.id} value={each} />
                  ))}
                </ul>
              </div>
              <div className="large">
                <div className="smallList1">
                  <p className="songItem" style={{paddingLeft: '120px'}}>
                    Track
                  </p>
                  <p className="songAlbum">Album</p>
                  <p className="songDuration" style={{paddingLeft: '70px'}}>
                    Time
                  </p>
                  <p className="songArtist">Artist</p>
                  <p className="songTime" style={{paddingRight: '20px'}}>
                    Added
                  </p>
                </div>

                <hr className="hr" />
                <ul className="smallUl">
                  {smallDetails.map((each, index) => (
                    <LargeDeviceDetails
                      key={each.id}
                      value={each}
                      number={index}
                    />
                  ))}
                </ul>
              </div>
              {ActiveSong && <MediaPlayer />}
            </div>
          )
        }}
      </SongContexts.Consumer>
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

export default PlayListDetails
