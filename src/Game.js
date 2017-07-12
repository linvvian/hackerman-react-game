import React, { Component } from 'react'
import Character from './character'
import BoardView from './gameboard'
import Bomb from './bomb'

class Game extends Component {
  constructor(){
    super()

    this.keys = {}

    this.state = {
      character: {
        x: 1,
        y: 1,
        isAlive: true,
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
    ],
      bombs: [],
      players: [
        { player: 1, x: 1, y: 1, isAlive: true },
        { player: 2, x: 11, y: 1, isAlive: true },
      ],
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

  isTileValid = (direction) => {
    const { x, y } = this.state.character
    switch (direction) {
      case 'LEFT':
        return this.state.board[y][x-1] === 1 ? true : false
        break;
      case 'RIGHT':
        return this.state.board[y][x+1] === 1 ? true : false
        break;
      case 'UP':
        return this.state.board[y-1][x] === 1 ? true : false
        break;
      case 'DOWN':
        return this.state.board[y+1][x] === 1 ? true : false
        break;
      default:
    }
  }

  move = (key) => {
    console.log(this.state.character)
    switch (key) {
      case 37:
        if(this.isTileValid('LEFT')){
          this.setState({
            character: {
              ...this.state.character,
              x: this.state.character.x - 1,
            }
          })
        }
        break;
      case 39:
        if(this.isTileValid('RIGHT')){
          this.setState({
            character: {
              ...this.state.character,
              x: this.state.character.x + 1,
            }
          })
        }
        break;
      case 38:
        if(this.isTileValid('UP')){
          this.setState({
            character: {
              ...this.state.character,
              y: this.state.character.y - 1,
            }
          })
        }
        break;
      case 40:
        if(this.isTileValid('DOWN')){
          this.setState({
            character: {
              ...this.state.character,
              y: this.state.character.y + 1,
            }
          })
        }
        break;
      case 32:
        const {x,y} = this.state.character
        let board = [...this.state.board]
        board[y][x] = 2
        const bomb = {x, y}
        this.setState({
          board: board,
          bombs: [...this.state.bombs, bomb ]
        })
        break
      default:

    }
  }

  tileCanBeExploded = (tile) => {
    const {x,y} = tile
    return this.state.board[y][x] !== 0
  }


  findBombRadius = (tile, radius) => {
    //return array of all tiles to be exploded
    const {x,y} = tile
    let tilesInRadius = [Object.assign({}, tile)]
    for (let i = 0; i < radius; i++) {
      if ( y + i + 1 < this.state.board.length) {
        tilesInRadius.push(Object.assign({}, tile,
          {y: y + i + 1}
        ))
      }
      if (y - i - 1 > 0) {
        tilesInRadius.push(Object.assign({}, tile,
          {y: y - i - 1}
        ))
      }
      if ( x + i + 1 < this.state.board.length) {
        tilesInRadius.push(Object.assign({}, tile,
          {x: x + i + 1}
        ))
      }
      if (x - i - 1 > 0) {
        tilesInRadius.push(Object.assign({}, tile,
          {x: x - i - 1}
        ))
      }
    }

    return tilesInRadius.filter(tile => this.tileCanBeExploded(tile))
  }

  isPlayerDead = (bombRadii) => {
    const playerCoord = this.state.character
    let isDead = false
    bombRadii.forEach((coord) => {
      if(playerCoord.x === coord.x && playerCoord.y === coord.y){
        this.setState({
          character: {
            ...this.state.character,
            isAlive: false,
          }
        })
        isDead = true
      }
    })
    return isDead
  }

  timerGoOff = (bomb_tile) => {
    const {x,y} = bomb_tile
    if (this.state.board[y][x] === 2) {
      this.explodeBomb(bomb_tile)
    }

  }

  explodeBomb = (bomb_tile) => {
    // let bombs = [...this.state.bombs]
    // const bomb = bombs.splice(0,1)[0]
    let board = [...this.state.board]
    const tilesToExplode = this.findBombRadius(bomb_tile,2)
    let chainedBombs = []
    for (let b = 0; b < tilesToExplode.length; b++) {
      const {x, y} = tilesToExplode[b]
      switch (board[y][x]) {
        case 1://open tile
          board[y][x] = 3
          break
        case 2: //a bomb, this or another one
          if (x !== bomb_tile.x || y !== bomb_tile.y) {
            chainedBombs.push(Object.assign({}, tilesToExplode[b]))
          }
          board[y][x] = 3
          break
        default:
          board[y][x] += 1

      } //end switch

    } //end for

    //board[bomb.y][bomb.x] = 3
    this.setState({board}, () => this.postExplode(tilesToExplode, chainedBombs))
  }

  postExplode = (tilesToReset, chainedBombs) => {
    const isDead = this.isPlayerDead(tilesToReset)
    console.log(isDead)
    setTimeout(() => this.resetTiles(tilesToReset), 1000)
    for (let b = 0; b < chainedBombs.length; b++) {
      setTimeout(() => this.explodeBomb(chainedBombs[b]), 100)
    }
  }

  resetTiles = (tilesToReset) => {
    //if tile.x === this.state.character.x && tile.y === this.state.character.y //kill player
    let board = [...this.state.board]
    for (let b = 0; b < tilesToReset.length; b++) {
      const {x, y} = tilesToReset[b]
      switch (board[y][x]) {
        case 1://open tile
          break
        case 2: //a bomb, this or another one
          break
        case 3:
          board[y][x] = 1
          break
        default:
          board[y][x] -= 1

      }
      // if(board[y][x] === 3) {
      //   board[y][x] = 1
      // } else if (board[y][x] === 5) {
      //   board[y][x] = 3
      // }
      //
    }
    this.setState({board})
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
      <div>
        <h1>Hackerman</h1>
        <h3>HACK OR BE HACKED</h3>
        <BoardView board={this.state.board} character={this.state.character} timeExplode={this.timerGoOff}/>
      </div>
    )
  }
}

export default Game
