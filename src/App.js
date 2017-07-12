import React, { Component } from 'react'

import Game from './Game_Components/game'

class App extends Component {

  render () {
    return (
      <div className='App'>
        <Game cableApp={this.props.cableApp} />
      </div>
    )
  }
}

export default App
