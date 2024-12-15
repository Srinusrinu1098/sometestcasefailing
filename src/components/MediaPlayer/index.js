import ReactAudioPlayer from 'react-audio-player'

import SongContexts from '../../SongContext/SongContexts'
import './index.css'

const MediaPlayer = () => (
  <SongContexts.Consumer>
    {contextValue => {
      const {oldSong} = contextValue

      return (
        <div style={{background: 'transparent'}}>
          <ReactAudioPlayer src={oldSong} autoPlay controls />
        </div>
      )
    }}
  </SongContexts.Consumer>
)
export default MediaPlayer
