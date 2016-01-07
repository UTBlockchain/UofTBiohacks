import React, { Component } from 'react'
import Layout from '../components/Layout'
import FMUI, { FormsyText } from 'formsy-material-ui'

import RaisedButton from 'material-ui/lib/raised-button'
import Snackbar from 'material-ui/lib/snackbar'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
      autoHideDuration: 3000,
      open: false,
      message: 'Invalid email/username and/or password'
    }
    console.log(this)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }
  enableButton() {
    this.setState({
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      canSubmit: false
    })
  }

  submitForm(model) {
    console.log('model: ' + JSON.stringify(model))
  }

  handleRequestClose() {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <Layout title="Login">
        <Formsy.Form
          onValid = {this.enableButton}
          onInvalid = {this.disableButton}
          onValidSubmit = {this.submitForm}>

          <FormsyText style={{display: 'block'}}
            name = 'emailOrUsername'
            required hintText = "What is your Email or Username?"
            floatingLabelText = "Email or Username"
          />

          <FormsyText style={{display: 'block'}}
            name = 'password'
            type = 'password'
            required hintText = "What is your password?"
            floatingLabelText = "Password"
          />

          <RaisedButton
            type = "submit"
            label = "Submit"
            disabled = {!this.state.canSubmit}
            />

          <Snackbar
            open={this.state.open}
            message={this.state.message}
            action="Close"
            autoHideDuration={this.state.autoHideDuration}
            onActionTouchTap={this.handleRequestClose}
            onRequestClose={this.handleRequestClose}
          />
        </Formsy.Form>
      </Layout>
    )
  }
}
