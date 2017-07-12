import React from 'react'
import {Icon} from 'semantic-ui-react'

export default class Bomb extends React.Component {

  componentDidMount () {
    setTimeout(this.props.explode, 3000)
  }
  render(){
    return(
      <div style={this.props.bombState}>
        <Icon name='bomb' size='large'/>
      </div>
    )
  }
}
