import './LargeDeviceDetails.css'
import moment from 'moment'
import SongContexts from '../../SongContext/SongContexts'

const LargeDeviceDetails = props => {
  const {value, number} = props
  const {songName, album, song, duration, artist, addedAt} = value
  const formattedDate = moment(addedAt).fromNow()

  const seconds = duration / 1000
  const minutes = Math.floor(seconds / 60)
  const remainSec = Math.floor(seconds % 60)
  const last = remainSec.toString().length === 1 ? `0${remainSec}` : remainSec

  return (
    <SongContexts.Consumer>
      {contextValue => {
        const {onToggleActiveSong, NewSong} = contextValue
        const changeTheBool = () => {
          onToggleActiveSong()
          NewSong(song)
          console.log(song)
        }
        return (
          <li className="smallList1" onClick={changeTheBool}>
            <div className="songItem">
              <p className="songIndex">{number + 1}</p>
              <p className="songName">{songName}</p>
            </div>
            <p className="songName">{album}</p>
            <p className="songDuration">
              {minutes}:{last}
            </p>
            <p className="songArtist">{artist}</p>
            <p className="songTime">{formattedDate}</p>
          </li>
        )
      }}
    </SongContexts.Consumer>
  )
}

export default LargeDeviceDetails
