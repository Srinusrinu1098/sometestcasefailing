import React from 'react'

const SongContexts = React.createContext({
  ActiveSong: false,
  oldSong: '',
  onToggleActiveSong: () => {},
  NewSong: () => {},
})

export default SongContexts
