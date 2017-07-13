import React, { Component, PropTypes } from 'react'
import './character.css'

export default class Character extends Component {

  render(){
    return (
      <td className='character' style={{'backgroundColor': this.props.color}}>
      </td>
    )
  }

}
