import React, { Component } from 'react'
import { Loop, Stage, TileMap } from 'react-game-kit'
import Character from './character'
import GameBoard from './gameboard'

class Game extends Component {
  constructor(){
    super()

    this.keys = {}

    this.state = {
      character: {
        x: 1,
        y: 1,
      },
      board: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
    }
  }

  subscribe = (keys) => {
    window.addEventListener('keydown', this.down)
    window.addEventListener('keyup', this.up)

    keys.forEach((key) => {
      this.keys[key] = false
    })
  }

  down = (event) => {
    let keyPressed = event.keyCode
    if (event.keyCode in this.keys) {
      event.preventDefault()
      this.keys[event.keyCode] = true
    }
    this.move(keyPressed)
  }

  move = (key) => {
    switch (key) {
      case 37:
      this.setState({
        character: {
          ...this.state.character,
          x: this.state.character.x - 1,
        }
      })
        break;
      case 39:
      this.setState({
        character: {
          ...this.state.character,
          x: this.state.character.x + 1,
        }
      })
        break;
      case 40:
      this.setState({
        character: {
          ...this.state.character,
          y: this.state.character.y + 1,
        }
      })
        break;
      case 38:
      this.setState({
        character: {
          ...this.state.character,
          y: this.state.character.y - 1,
        }
      })
        break;
      default:

    }
  }

  up = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault()
      this.keys[event.keyCode] = false
    }
    this.setState({
      character: {
        ...this.state.character,
        characterState: 2,
      }
    })
  }


  componentDidMount(){
    this.subscribe([
     37, 39, 38, 40, 32
   ])
  //  LEFT, RIGHT, UP, DOWN, SPACE
  }

  render(){
    return(
      <GameBoard board={this.state.board} character={this.state.character}/>
    )
  }
}

export default Game
