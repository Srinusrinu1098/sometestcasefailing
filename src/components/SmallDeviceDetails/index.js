import './SmallDeviceDetails.css'
import SongContexts from '../../SongContext/SongContexts'

const SmallDeviceDetails = props => {
  const {value} = props
  const {songName, song, duration, artist} = value
  console.log(artist)

  const seconds = duration / 1000
  const minutes = Math.floor(seconds / 60)
  const remainSec = Math.floor(seconds % 60)
  const last = remainSec.toString().length === 1 ? `0${remainSec}` : remainSec

  return (
    <SongContexts.Consumer>
      {contextvalue => {
        const {onToggleActiveSong, NewSong} = contextvalue
        const changeTheBool = () => {
          onToggleActiveSong()
          NewSong(song)
          console.log(song)
        }
        return (
          <li className="smallList" onClick={changeTheBool}>
            <div>
              <h3 className="smallSongName">{songName}</h3>
              <p className="smallSongName">{artist}</p>
            </div>
            <p className="smallSongName">
              {minutes}:{last}
            </p>
          </li>
        )
      }}
    </SongContexts.Consumer>
  )
}

export default SmallDeviceDetails
