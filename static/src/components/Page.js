import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'

import Html from './Html.js'

export default class Page extends Component {
  render() {
    const { body } = this.props

    // TODO implement more meta tags for better SEO
    // see: https://support.google.com/webmasters/answer/79812?hl=en
    const metas = {
      viewport: 'width=device-width, initial-scale=1',
      description: 'UofT BioHacks 2016 Website',
      author: 'iGEM Toronto'
    }

    const htmlProps = {
      title: 'UofT BioHacks',
      meta: metas,
      body: ReactDOMServer.renderToString(body)
    }

    return (
      <Html {...htmlProps} />
    )
  }
}