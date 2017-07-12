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
        { player: 1, x: 1, y: 1, isAlive: true, color: 'white' },
        { player: 2, x: 11, y: 1, isAlive: true, color: 'blue' },
      ],
    }
  }

  subscribe = (keys) => {
    window.addEventListener('keydown', this.down)
    window.addEventListener('keyup', this.up)
  }

  down = (event) => {
    let keyPressed = event.keyCode
    event.preventDefault()
    this.move(keyPressed)
  }

  isTileValid = (direction, character) => {
    const { x, y } = character
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
    const player1 = {...this.state.players[0]}
    const player2 = {...this.state.players[1]}
    const board = [...this.state.board]

    switch (key) {
      case 37: //LEFT ARROW
        if(this.isTileValid('LEFT', player1)){
          player1.x = player1.x - 1
        }
        break;
      case 39: //RIGHT ARROW
        if(this.isTileValid('RIGHT', player1)){
          player1.x = player1.x + 1
        }
        break;
      case 38: //UP ARROW
        if(this.isTileValid('UP', player1)){
          player1.y = player1.y - 1
        }
        break;
      case 40: //DOWN ARROW
        if(this.isTileValid('DOWN', player1)){
          player1.y = player1.y + 1
        }
        break;
      case 65: //A KEY LEFT
        if(this.isTileValid('LEFT', player2)){
          player2.x = player2.x - 1
        }
        break;
      case 68: //D KEY RIGHT
        if(this.isTileValid('RIGHT', player2)){
          player2.x = player2.x + 1
        }
        break;
      case 87: //W KEY UP
        if(this.isTileValid('UP', player2)){
          player2.y = player2.y - 1
        }
        break;
      case 83: //S KEY DOWN
        if(this.isTileValid('DOWN', player2)){
          player2.y = player2.y + 1
        }
        break;
      case 16: //LEFT SHIFT BOMB
        board[player2.y][player2.x] = 2
        const bomb2 = { x: player2.x, y: player2.y}
        this.setState({
          board: board,
          bombs: [...this.state.bombs, bomb2 ]
        })
        break
      case 32: //SPACEBAR BOMB
        board[player1.y][player1.x] = 2
        const bomb1 = { x: player1.x, y: player1.y}
        this.setState({
          board: board,
          bombs: [...this.state.bombs, bomb1 ]
        })
        break
      default:
    }

    this.setState({
      ...this.state,
      players: [player1, player2],
    })
  }

  tileCanBeExploded = (tile) => {
    const {x,y} = tile

    return tile !== 0
  }

  isPastWall = (tiles) => {
    let tilesInRadius = tiles
    tilesInRadius.forEach((tile, index) => {
      const {x,y} = tile
      if (tile !== 0 && this.state.board[y][x] === 0){
        tilesInRadius[index] = 0
        let nextTo = index + 4
        while(nextTo <= tilesInRadius.length) {
          tilesInRadius[nextTo] = 0
          nextTo += 3
        }
      }
    })
    return tilesInRadius
  }

  findBombRadius = (tile, radius) => {
    //return array of all tiles to be exploded
    const {x,y} = tile
    let tilesInRadius = [{...tile}]
    for (let i = 0; i < radius; i++) {
      // DOWN RADIUS
      // if ( y + i + 1 < this.state.board.length && this.state.board[x][y]) {
        tilesInRadius.push(Object.assign({}, tile,
          {y: y + i + 1}
        ))
      // }
      // UP RADIUS
      // if (y - i - 1 > 0) {
        tilesInRadius.push(Object.assign({}, tile,
          {y: y - i - 1}
        ))
      // }
      // RIGHT RADIUS
      // if ( x + i + 1 < this.state.board.length) {
        tilesInRadius.push(Object.assign({}, tile,
          {x: x + i + 1}
        ))
      // }
      // LEFT RADIUS
      // if (x - i - 1 > 0) {
        tilesInRadius.push(Object.assign({}, tile,
          {x: x - i - 1}
        ))
      // }
    }
    return this.isPastWall(tilesInRadius).filter(tile => this.tileCanBeExploded(tile))
  }

  isPlayerDead = (bombRadii) => {
    const playerCoord = this.state.character
    bombRadii.forEach((coord) => {
      if(playerCoord.x === coord.x && playerCoord.y === playerCoord.y){
        this.setState({
          character: {
            ...this.state.character,
            isAlive: false,
          }
        })
        return true
      }
    })
    return false
  }

  explodeBomb = () => {
    let bombs = [...this.state.bombs]
    const bomb = bombs.splice(0,1)[0]
    let board = [...this.state.board]
    const tilesToExplode = this.findBombRadius(bomb,2)
    for (let b = 0; b < tilesToExplode.length; b++) {
      const {x, y} = tilesToExplode[b]
      board[y][x] = 3
    }
    //board[bomb.y][bomb.x] = 3
    this.setState({board, bombs}, () => setTimeout(() => this.resetTiles(tilesToExplode), 500))
  }

  resetTiles = (tilesToReset) => {
    //if tile.x === this.state.character.x && tile.y === this.state.character.y //kill player
    let board = [...this.state.board]
    for (let b = 0; b < tilesToReset.length; b++) {
      const {x, y} = tilesToReset[b]
      board[y][x] = 1
    }
    this.setState({board})
  }

  up = (event) => {
    event.preventDefault()
    // this.setState({
    //   character: {
    //     ...this.state.character,
    //     characterState: 2,
    //   }
    // })
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
        <BoardView board={this.state.board} players={this.state.players} character={this.state.character} explode={this.explodeBomb}/>
      </div>
    )
  }
}

export default Game
