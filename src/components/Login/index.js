import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './LoginStyle.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  userName = event => {
    this.setState({username: event.target.value})
  }

  passWord = event => {
    this.setState({password: event.target.value})
  }

  renderSuccess = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 5})
    history.replace('/')
  }

  renderFailure = error => {
    this.setState({errorMsg: error})
  }

  submitLogin = async event => {
    const {username, password} = this.state
    event.preventDefault()
    try {
      const url = 'https://apis.ccbp.in/login'
      const userDetails = {username, password}
      const options = {
        method: 'POST',
        body: JSON.stringify(userDetails),
      }

      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.renderSuccess(data.jwt_token)
      } else if (response.status === 400) {
        this.renderFailure(data.error_msg)
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {errorMsg} = this.state
    const Token = Cookies.get('jwt_token')
    if (Token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="background-image">
        <form className="card-container" onSubmit={this.submitLogin}>
          <img
            className="music-img"
            src="https://i.ibb.co/5cyGN0S/Frame-52.png"
            alt="login website logo"
          />
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            className="input"
            type="text"
            placeholder="Enter your Username"
            onChange={this.userName}
            id="username"
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            className="input"
            type="password"
            placeholder="Enter your Password"
            onChange={this.passWord}
            id="password"
          />
          <button className="login-button" type="submit">
            Login
          </button>
          {errorMsg.length !== 0 && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
