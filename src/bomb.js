import React from 'react'
import {Icon} from 'semantic-ui-react'

export default class Bomb extends React.Component {

  componentDidMount () {
    setTimeout(() =>this.props.timeExplode(this.props.tile), 3000)
  }
  render () {
    return (
      <div>
        <Icon name='bomb' size='large' />
      </div>
    )
  }
}
