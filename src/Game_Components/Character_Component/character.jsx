import React, { Component, PropTypes } from 'react'

export default class Character extends Component {

  render(){
    return (
      <td className='character' style={{'backgroundColor': this.props.color}}>
      </td>
    )
  }

}
