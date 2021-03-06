import React, { Component } from 'react'
import { connect } from 'react-redux'
import mount from '../mount.js'

// Components
import Recaptcha from 'react-recaptcha'
import FMUI, { FormsyText, FormsySelect, FormsyToggle, FormsyRadio, FormsyRadioGroup, FormsyCheckbox } from 'formsy-material-ui'
import { Snackbar, RaisedButton, MenuItem, Checkbox } from 'material-ui/lib'
import { Row, Col } from 'react-bootstrap'
import Layout from '../components/Layout'
import MyRadioGroup from '../components/MyRadioGroup.js'
import PureTextInput from '../components/PureTextInput.js'
import PureRadioGroup from '../components/PureRadioGroup.js'
import PureSelect from '../components/PureSelect.js'
import PureCheckBox from '../components/PureCheckbox.js'

import CircularProgress from 'material-ui/lib/circular-progress';

// Reducers
import snacker from '../reducers/snacker.js'
import submission from '../reducers/submission.js'

// Actions
import { openSnack } from '../actions/snacker'
import { canSubmit, submitForm, canNotSubmit, loadResponse } from '../actions/submission.js'

// Util
import { ajaxPost } from '../util/ajax.js'

// Constants
import { BASE_URI } from '../constants/uris.js'

// Styles
import '../styles/Register.scss'

class Register extends Component {
  constructor() {
    super()
    this.state = {
      customSchool: false,
      canSubmit: false,
      disabled: false
    }
  }

  submitForm = (model) => {
    const { dispatch } = this.props
    const captchaVerify = grecaptcha.getResponse()
    model.year = Number(model.year)
    if (model.school === 'other' && (model.customSchool === undefined || model.customSchool === '')) {
      dispatch(openSnack('Please fill in other school'))
      return
    }
    if(model.about && model.about.length > 1200){
      return dispatch(openSnack("Your bio exceeds 1200 characters"))
    }
    if (captchaVerify.length !== 0) {
      if (model.customSchool) {
        model.school = model.customSchool
      }

      if (model.mentor) {
        model.mentor = true
      } else {
        model.mentor = false
      }

      if (model.autogroup) {
        model.autogroup = true
      } else {
        model.autogroup = false
      }

      dispatch(canNotSubmit())
      dispatch(openSnack("Validating..."))
      ajaxPost(model, '/user/register', null, (err, data) => {
        if (err) {
          console.error(err)
        } else {
          if(data.success){
            dispatch(openSnack(data.message + ". Redirecting in 5 seconds"))
            dispatch(canNotSubmit())
            this.setState({
              disabled: true
            })
            setTimeout(() => window.location.assign('/') ,5000)
          }else{
            dispatch(openSnack(data.message))
            dispatch(canSubmit())
          }
        }
      })
    } else {
      dispatch(openSnack('Please do reCAPTCHA'))
    }
  };


  render() {
    const { submission, dispatch } = this.props
    // if (canUseDOM)
    //   setTimeout(() => window.location.assign('/') ,5000)
    return(
    <Layout push>
        <div className="container">
          <Row>
            <Col className="WideForm" xs={12} md={6} mdOffset={3}>
              <h2>Apply</h2>

              <Formsy.Form
                onValidSubmit = {this.submitForm}
                onValid = {() => dispatch(canSubmit())}
                onInvalid = {() => dispatch(canNotSubmit())}
              >
                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'email'
                    validations="isEmail"
                    validationError={'Invalid email'}
                    hintText = "Email"
                    floatingLabelText = "Email*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'username'
                    validations={{matchRegexp: /.+/}}
                    validationError="At least one character please"
                    hintText = "Username"
                    floatingLabelText = "Username*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'firstName'
                    hintText = "First Name"
                    floatingLabelText = "First Name*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'lastName'
                    hintText = "Last Name"
                    floatingLabelText = "Last Name*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'education'
                    hintText = "What is your program of study?"
                    floatingLabelText = "What is your program of study?*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureSelect
                    required
                    name='school'
                    floatingLabelText='School*'
                    items={[
                      { value: 'uoft', text: "University of Toronto" },
                      { value: 'western', text: 'Western University' },
                      { value: 'queens', text: "Queen's University" },
                      { value: 'waterloo', text: "University of Waterloo" },
                      { value: 'mcmaster', text: "McMaster University" },
                      { value: 'trent', text: 'Trent University' },
                      { value: 'ryerson', text: "Ryerson University" },
                      { value: 'york', text: "York University" },
                      { value: 'ottawa', text: "University of Ottawa" },
                      { value: 'notInSchool', text: "Not in School" },
                      { value: 'other', text: "Other" }
                    ]}
                    disabled={this.state.disabled}
                  />
                </div>
                <div className="fullWidth">
                  <PureTextInput
                    name = 'customSchool'
                    hintText = 'Other School if not in list'
                    floatingLabelText = 'Other School'
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureSelect
                    required
                    name='college'
                    floatingLabelText='UofT College*'
                    items={[
                      { value: "St.Michael's", text: "St.Michael's College" },
                      { value: 'Victoria', text: 'Victoria College' },
                      { value: 'Innis', text: 'Innis College' },
                      { value: 'New', text: 'New College' },
                      { value: 'University', text: 'University College' },
                      { value: 'Trinity', text: 'Trinity' },
                      { value: 'Woodsworth', text: 'Woodsworth College' },
                      { value: 'N/A', text: 'N/A' }
                    ]}
                    disabled={this.state.disabled}
                  />
                </div>



                <div className="fullWidth">
                  <PureSelect
                    required
                    name='year'
                    floatingLabelText="Year of Study*"
                    items={[
                      { value: '1', text: "1" },
                      { value: '2', text: "2" },
                      { value: '3', text: "3" },
                      { value: '4', text: "4" },
                      { value: '5', text: "5" },
                      { value: '99999', text: "5+" },
                      { value: '-1', text: "n/a" }
                    ]}
                    disabled={this.state.disabled}
                  />
                </div>

                <p>
                  How did you hear about the event?
                </p>
                <div className="fullWidth">
                  <MyRadioGroup
                    type="checkbox"
                    name="hearFrom"
                    pairs={[
                      { value: 'hearFacebook', label: 'Facebook' },
                      { value: 'hearMailingList', label: 'Mailing List' },
                      { value: 'hearWordOfMouth', label: 'Word of Mouth' },
                      { value: 'hearOther', label: 'Other' }
                    ]}
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureSelect
                    required
                    name='codingBackground'
                    floatingLabelText='Coding Background*'
                    items={[
                      { value: 'none', text: "None" },
                      { value: 'little', text: "A little" },
                      { value: 'moderate', text: "Moderate" },
                      { value: 'good', text: "Good" },
                      { value: 'proficient', text: "Proficient" }
                    ]}
                    disabled={this.state.disabled}
                  />

                </div>


                <div className="fullWidth">
                  <PureTextInput
                    name = 'github'
                    hintText = "Just your username."
                    floatingLabelText = "GitHub"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    name = 'about'
                    required
                    hintText = "1200 character limit"
                    floatingLabelText = "Tell us about yourself*"
                    multiLine={true}
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'password'
                    type = 'password'
                    validations={{matchRegexp: /.{7}.+/}}
                    validationError="At least eight characters please"
                    hintText = "What is your password?"
                    floatingLabelText = "Password*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="fullWidth">
                  <PureTextInput
                    required
                    name = 'confirmpassword'
                    type = 'password'
                    validations="equalsField:password"
                    validationError="Does not match"
                    hintText = "Confirm Password"
                    floatingLabelText = "Confirm Password*"
                    disabled={this.state.disabled}
                  />
                </div>

                <div className="recaptcha-wrapper">
                  <Recaptcha
                    sitekey={RECAPTCHA_SITE_KEY}
                    verifyCallback={this.verifyCaptcha}
                  />
                </div>

                <p>
                  If you would like us to pass your resume onto our sponsors,
                  please email it to <a href="mailto:bcbbiohacks2018@gmail.com">bcbbiohacks2018@gmail.com</a>.
                </p>
                <p>
                  If you are interested in volunteering, see this <a target="_blank" href="https://goo.gl/forms/V3ujQb3Wt1qNXMYr1">form</a>.
                </p>
                <div className="fullWidth">
                  <RaisedButton
                    type = "submit"
                    label = "Submit"
                    disabled = {!submission.canSubmit}
                  />
                </div>
              </Formsy.Form>
            </Col>
          </Row>
        </div>
</Layout>
    )
  }
}

const mapStateToProps = ({ snacker, submission }) => ({ snacker, submission })
export default mount(connect(mapStateToProps)(Register), { snacker, submission })
