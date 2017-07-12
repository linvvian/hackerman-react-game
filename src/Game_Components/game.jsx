import React, { Component } from 'react'
import Character from './Character_Component/character'
import BoardView from './BoardView_Component/boardview'
import Bomb from './Bomb_Component/bomb'

class Game extends Component {
  constructor(props){
    super(props)

    this.keys = {}

    this.state = {
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
      players: [
        { player: 1, x: 1, y: 1, isAlive: true, color: 'white' },
        { player: 2, x: 11, y: 1, isAlive: true, color: 'blue' },
      ],
    }
  }

   handleSendState = () => {
     console.log(this.props.cableApp)
     this.props.cableApp.state.send({...this.state})
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
    if(!character.isAlive) return
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
        }, this.handleSendState)
        break
      case 32: //SPACEBAR BOMB
        board[player1.y][player1.x] = 2
        const bomb1 = { x: player1.x, y: player1.y}
        this.setState({
          board: board,
        }, this.handleSendState)
        break
      default:
    }

    this.setState({
      ...this.state,
      players: [player1, player2],
    }, this.handleSendState)
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
    let isDead = false
    let players = [...this.state.players]

    players.forEach((playerCoord) => {
      bombRadii.forEach((coord) => {
        if(playerCoord.x === coord.x && playerCoord.y === coord.y){
          playerCoord.isAlive = false
          playerCoord.x = 0
          playerCoord.y = 0
          isDead = true
        }
      })
    })

    this.setState({
      players: [...players]
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

  console.log('mounted')
  this.props.cableApp.state = this.props.cableApp.cable.subscriptions.create({channel: "GameChannel", room: "One" },
     {
       received: (state) => {
         this.setState({ ...state })
       }
     })
    console.log(this.props.cableApp.board)
  }

  render(){
    return(
      <div>
        <h1>Hackerman</h1>
        <h3>HACK OR BE HACKED</h3>

        <BoardView board={this.state.board} players={this.state.players} character={this.state.character} timeExplode={this.timerGoOff}/>

      </div>
    )
  }
}

export default Game
