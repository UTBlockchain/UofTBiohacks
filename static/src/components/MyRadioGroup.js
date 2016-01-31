import React from 'react'
import PureComponent from 'react-pure-render/component'

import {FormsyRadio, FormsyRadioGroup, FormsyCheckbox } from 'formsy-material-ui'

import { RadioGroup } from 'formsy-react-components'

export default class MyRadioGroup extends PureComponent {
  render() {
    const { type, name, pairs, disabled } = this.props

    return (
    <fieldset>
      <RadioGroup type="stacked" name={name} options={pairs} disabled={disabled}></RadioGroup>
    </fieldset>)
  }
}
