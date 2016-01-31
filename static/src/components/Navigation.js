import React, { Component } from 'react'

import '../styles/navigation.scss'

export default class Navigation extends Component {
  logout() {
    sessionStorage.removeItem('jwt')
    window.location.assign('/')
  }

  render() {
    // loggedIn or loggedOut
    const { title, status } = this.props

    // TODO Routes should come from constants
    // TODO extend a "base links"
    const routes = {
      whenLoggedIn: ['/', '/account', '!logout'],
      whenLoggedOut: ['/', '/register', '/login' ]
    }

    const linkPusher = (routes) => {
      let links = []

      routes.forEach( (link, i) => {
        if (link === '/')
          links.push(<li key={i}><a href={link} className="navLink nav-link">home</a></li>)

        if (link.charAt(0) === '/' && link !== '/')
          links.push(<li key={i}><a href={link} className="navLink nav-link">{link.substr(1)}</a></li>)

        if (link === '!logout')
          links.push(<li key={i}><a onClick={this.logOut} className="navLink nav-link">log out</a></li>)
      })

      return links
    }

    const links = ( () => {
      if (status === 'loggedIn') {
        return linkPusher(routes.whenLoggedIn)
      } else if (status === 'loggedOut') {
        return linkPusher(routes.whenLoggedOut)
      }
    })()

    return(
      <nav className="Navigation navbar navbar-default navbar-fixed-top">
        <div className="container">

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{title}</a>
          </div>

          <div id="navbar" className="navbar-collapse collapse" aria-expanded="false">
            <ul className="nav navbar-nav navbar-right">
              {links}
            </ul>
          </div>

        </div>
      </nav>
    )
  }
}