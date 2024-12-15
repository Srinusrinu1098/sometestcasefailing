import {Component} from 'react'
import {Link} from 'react-router-dom'
import {GoArrowLeft} from 'react-icons/go'

class NotFound extends Component {
  goBack = () => {
    const {history} = this.props
    history.replace('/')
  }

  render() {
    return (
      <div className="main-container">
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="https://i.ibb.co/HGZZSyB/404.png"
            alt="page not found"
            style={{
              maxWidth: '300px',
              margin: '24px',
              paddingTop: '15%',
            }}
          />
          <h5
            style={{
              color: '#ffffff',
            }}
          >
            PAGE NOT FOUND
          </h5>
          <Link to="/">
            <button
              type="button"
              style={{
                background: 'transparent',
                border: '1px solid',
                height: '28px',
                color: '#ffffff',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Home Page
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default NotFound
