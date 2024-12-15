import {Component} from 'react'

import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import PlayListDetails from './components/PlayListDetails'
import CategoriesListDetails from './components/CategoriesListDetails'
import AlbumListDetails from './components/AlbumListDetails'
import SongContexts from './SongContext/SongContexts'
import NotFound from './components/NotFound'
import './App.css'

class App extends Component {
  state = {ActiveSong: false, oldSong: ''}

  change = () => {
    this.setState({ActiveSong: true})
  }

  NewSong = value => {
    this.setState({oldSong: value})
  }

  render() {
    const {ActiveSong, oldSong} = this.state
    return (
      <SongContexts.Provider
        value={{
          ActiveSong,
          onToggleActiveSong: this.change,
          oldSong,
          NewSong: this.NewSong,
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/Login" component={Login} />
          <ProtectedRoute
            exact
            path="/playlist/:id"
            component={PlayListDetails}
          />
          <ProtectedRoute
            exact
            path="/category/:id/playlists"
            component={CategoriesListDetails}
          />
          <ProtectedRoute
            exact
            path="/album/:id"
            component={AlbumListDetails}
          />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </SongContexts.Provider>
    )
  }
}

export default App
