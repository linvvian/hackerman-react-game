import React from 'react'
import {Icon} from 'semantic-ui-react'

export default class Bomb extends React.Component {


  render(){
    return(
      <div style={this.props.bombState}>
        <Icon name='bomb' size='large'/>
      </div>
    )
  }
}
