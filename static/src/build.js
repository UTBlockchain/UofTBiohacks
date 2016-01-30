import mkdirpAsync from 'mkdirp-then'
import fsp from 'fs-promise'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import chalk from 'chalk'

import Page from './components/Page.js'

// auto generated by loaders/routes.js
const routes = {}

console.log(chalk.magenta('Found these pages:'))
Object.keys(routes).map(r => console.log(r))

Object.keys(routes).forEach(async function(route) {
  console.log(chalk.magenta(`Attempting ${chalk.blue('React.createElement')} on ${route}`))

  // Handle un-connect() wrapped components
  console.log(routes[route])
  console.log(Object.keys(routes[route]()))
  let component
  try {
    component = routes[route]().default
  } catch(e) {
    console.log('component err, ', e)
  }
  console.log(`got the default export for ${route}`)

  if (typeof(component) === 'function') {
    try {
      console.log(route)
      component = React.createElement(component)
    } catch(e) {
      console.log('build.js: ', e)
    }
  }
  let name = route.split("/")[0]
  console.log(`Before page for ${name}`)

  route = 'dist/' + route

  let page
  try {
    page =
    '<!doctype html>\n'
    + ReactDOMServer.renderToStaticMarkup(<Page body={component} name={name}/>)
  } catch(e) {
    console.log('static markup:' , e)
  }

  console.log(chalk.green(`Created element for ${route}`))

  try {
    const dir = route.replace(/\/index.js$/, '')
    const filename = route.replace(/\.js$/, '.html')
    await mkdirpAsync(dir)
    await fsp.writeFile(filename, page)
    console.log('wrote ' + chalk.green(filename))
  } catch(e) {
    console.log('didnt write')
    console.error(e)
  }
})
