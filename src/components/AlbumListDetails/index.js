import {Component} from 'react'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {GoArrowLeft} from 'react-icons/go'
import SmallDeviceDetails from '../SmallDeviceDetails'
import Loading from '../Loading'
import SongContexts from '../../SongContext/SongContexts'
import MediaPlayer from '../MediaPlayer'
import AlbumLargeDevices from '../AlbumLargeDevices'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class AlbumListDetails extends Component {
  state = {
    ActiveStatus: status.initial,
    releaseBanner: {},
    newReleaseData: [],
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

      const url = `https://apis2.ccbp.in/spotify-clone/album-details/${id}`
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
        const updatedRelease = {
          image: data.images[0].url,
          name: data.name,
          label: data.label,
        }

        const updatedReleaseData = data.tracks.items.map(each => ({
          artist: each.artists[0].name,
          songName: each.name,
          id: each.id,
          duration: each.duration_ms,
          song: each.preview_url,
        }))

        this.setState({
          ActiveStatus: status.success,
          releaseBanner: updatedRelease,
          newReleaseData: updatedReleaseData,
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
    const {releaseBanner, newReleaseData} = this.state
    console.log(newReleaseData)
    const {name, label, image} = releaseBanner
    return (
      <SongContexts.Consumer>
        {contextValue => {
          const {ActiveSong} = contextValue
          const {newValue} = this.state

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
                  src={image}
                  alt="featured playlist"
                  className="banner-img"
                />
                <div className="name-para">
                  <h1 className="name-heading">{name}</h1>
                  <p className="name-para">{label}</p>
                </div>
              </div>
              <div className="small">
                <ul className="smallUl">
                  {newReleaseData.map(each => (
                    <SmallDeviceDetails key={each.id} value={each} />
                  ))}
                </ul>
              </div>
              <div className="large">
                <div className="smallList1">
                  <p className="songItem" style={{paddingLeft: '120px'}}>
                    Track
                  </p>

                  <p className="songDuration" style={{paddingLeft: '70px'}}>
                    Time
                  </p>
                  <p className="songArtist">Artist</p>
                </div>

                <hr className="hr" />
                <ul className="smallUl">
                  {newReleaseData.map((each, index) => (
                    <AlbumLargeDevices
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

export default AlbumListDetails
