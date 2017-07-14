import React, { Component } from 'react'
import BoardView from './BoardView_Component/boardview'
import JoinButton from './Button_Component/join_game_button'
import StartButton from './Button_Component/start_game_button'

const initBoard = [
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

class Game extends Component {
  constructor(props){
    super(props)

    this.state = {
      board: [
        ...initBoard
    ],
      players: [],
    }
  }

  componentWillMount = () => {
    this.player_id = Math.random().toString(36).substring(7)
    this.bomb_radius = 1
    this.max_bombs = 1
    this.bombs = 1
  }

  componentDidMount(){
    this.subscribe([
     37, 39, 38, 40, 32
   ])
  //  LEFT, RIGHT, UP, DOWN, SPACE

  // this.generateBlocks()

  this.props.cableApp.state = this.props.cableApp.cable.subscriptions.create({channel: "GameChannel", room: "One" },
   {
     received: (state) => {
       console.log(state, 'new state in receiving')
       if (state.board) { this.setState({ board: state.board }) }
       if (state.players) { this.setState({ players: [...state.players] }) }
       if (state.player) {
         const newBoard = [...this.state.board]
         let tileSteppedOn = newBoard[state.player.y][state.player.x]
         console.log(tileSteppedOn, 'stepped on')
         if (tileSteppedOn === 2 || tileSteppedOn ===3) {
           tileSteppedOn = 1
         }
         const index = state.player.player - 1
         let allPlayers = [...this.state.players]
         allPlayers[index] = state.player

         this.setState({
          board: newBoard,
          players: allPlayers,
         })
       }
       if (state.bomb) {
         const wholeBoard = [...this.state.board]
         wholeBoard[state.bomb.y][state.bomb.x] = state.bomb.value
         this.setState({
           board: wholeBoard,
         })
       }
       if (state.powerUp) {
         const wholeBoard = [...this.state.board]
         wholeBoard[state.powerUp.y][state.powerUp.x] = state.powerUp.value
         this.setState({
           board: wholeBoard,
         })
       }
      //  this.setState({ ...state })
     }
   })
  }

  myPlayer = () => {
    let result = false
    this.state.players.forEach((player) => {
      if(player.player_id === this.player_id){
        result = player
      }
    })
    return result
  }

   handleSendState = (newValue, type) => {
     console.log(newValue, type)
     switch (type) {
      case 'board':
        this.props.cableApp.state.send({board: newValue})
         break
      case 'players':
        this.props.cableApp.state.send({players: newValue})
         break
      case 'player':
        this.props.cableApp.state.send({player: newValue})
         break
      case 'bomb':
        this.props.cableApp.state.send({bomb: newValue})
         break
      case 'powerUp':
        this.props.cableApp.state.send({powerUp: newValue})
        break
       default:
     }
   }

   //listeners and movement functions

  subscribe = (keys) => {
    window.addEventListener('keydown', this.down)
    window.addEventListener('keyup', this.up)
  }

  down = (event) => {
    let keyPressed = event.keyCode
    event.preventDefault()
    this.move(keyPressed)
  }

  up = (event) => {
    event.preventDefault()
  }

  isTileValid = (direction, character) => {
    const { x, y } = character
    let board = [...this.state.board]
    if(!character.isAlive) return
    let nextTile
    let coordinate
    switch (direction) {
      case 'LEFT':
        nextTile = board[y][x-1]
        coordinate = { x: x-1, y }
        break;
      case 'RIGHT':
        nextTile = board[y][x+1]
        coordinate = { x: x+1, y }
        break;
      case 'UP':
        nextTile = board[y-1][x]
        coordinate = { x, y: y-1 }
        break;
      case 'DOWN':
        nextTile = board[y+1][x]
        coordinate = { x, y: y+1 }
        break;
      default:
    }

    switch(nextTile) {
      case 1:
        return true
        break
      case 2:
        character.bombs += 1
        board[coordinate.y][coordinate.x] = 1
        return true
        break
      case 3:
        if (character.blast < 9) {character.blast += 1}
        board[coordinate.y][coordinate.x] = 1
        return true
        break
      default:
    }

    this.handleSendState(board, 'board')
  }

  isPowerUp = (tileValue) => {
    const random = Math.round(Math.random() * 1)
    if (tileValue !== 5) return

  }

  move = (key) => {
    let player1
    player1 = this.myPlayer()
    if(!this.myPlayer().isAlive) return
    let board = [...this.state.board]

    switch (key) {
      case 37: //LEFT ARROW
        if(this.isTileValid('LEFT', player1)){
          player1.x = player1.x - 1
          board[player1.y][player1.x] = 1
        }
        break;
      case 39: //RIGHT ARROW
        if(this.isTileValid('RIGHT', player1)){
          player1.x = player1.x + 1
          board[player1.y][player1.x] = 1
        }
        break;
      case 38: //UP ARROW
        if(this.isTileValid('UP', player1)){
          player1.y = player1.y - 1
          board[player1.y][player1.x] = 1
        }
        break;
      case 40: //DOWN ARROW
        if(this.isTileValid('DOWN', player1)){
          player1.y = player1.y + 1
          board[player1.y][player1.x] = 1
        }
        break;
      case 32: //SPACEBAR BOMB
        if (player1.bombs === 0) return
        const bombValue = player1.player * 10 + player1.blast
        const bomb1 = { x: player1.x, y: player1.y, value: bombValue }
        player1.bombs -= 1
        this.handleSendState(bomb1, 'bomb')
        break
      default:
    }

    let players = [...this.state.players]
    const index = players.indexOf(this.myPlayer())
    players[index] = player1

    this.handleSendState(player1, 'player')
  }

  //explosion functions

  tileCanBeExploded = (tile) => {
    const {x,y} = tile

    return tile !== 0
  }

  isPastWall = (tiles) => {
    let tilesInRadius = tiles

    tilesInRadius.forEach((tile, index) => {
      const {x,y} = tile
      if (tile === 0) return
      if (this.state.board[y][x] === 0){
        tilesInRadius[index] = 0
        let nextTo = index + 4
        while(nextTo <= tilesInRadius.length) {
          tilesInRadius[nextTo] = 0
          nextTo += 4
        } //to find walls and prevent fire past it
      } else if (this.state.board[y][x] === 5){
        let nextTo = index + 4
        while(nextTo <= tilesInRadius.length) {
          tilesInRadius[nextTo] = 0
          nextTo += 4
        }
      } //to find blocks and prevent fire past it
    })

    return tilesInRadius
  }

  findBombRadius = (tile, radius) => {
    //return array of all tiles to be exploded
    const {x,y} = tile
    let tilesInRadius = [{...tile}]
    for (let i = 0; i < radius; i++) {
        tilesInRadius.push(Object.assign({}, tile,
          {y: y + i + 1}
        ))
        tilesInRadius.push(Object.assign({}, tile,
          {y: y - i - 1}
        ))
        tilesInRadius.push(Object.assign({}, tile,
          {x: x + i + 1}
        ))
        tilesInRadius.push(Object.assign({}, tile,
          {x: x - i - 1}
        ))
    }
    return this.isPastWall(tilesInRadius).filter(tile => this.tileCanBeExploded(tile))
  }



  timerGoOff = (bomb_tile) => {
    const {x,y} = bomb_tile
    const bomb = {x,y, value: this.state.board[y][x]}
    if (bomb.value > 10 && bomb.value < 50) {
      this.explodeBomb(bomb)
    }
  }

  extractBombDetails = (bombValue) => {
    let playerNum
    let blastRadius
    if (bombValue < 50 && bombValue > 40) {
      playerNum = 4
      blastRadius = bombValue - 40
    } else if (bombValue < 40 && bombValue > 30) {
      playerNum = 3
      blastRadius = bombValue - 30
    } else if (bombValue < 30 && bombValue > 20) {
      playerNum = 2
      blastRadius = bombValue - 20
    } else if (bombValue < 20 && bombValue > 10) {
      playerNum = 1
      blastRadius = bombValue - 10
    }
    return {playerNum, blastRadius}
  }

  explodeBomb = (bomb) => {
    const bombDetails = this.extractBombDetails(bomb.value)

    let board = [...this.state.board]
    const bomb_tile = {x: bomb.x, y: bomb.y}
    const tilesToExplode = this.findBombRadius(bomb_tile,bombDetails.blastRadius)
    let chainedBombs = []

    for (let b = 0; b < tilesToExplode.length; b++) {
      const {x, y} = tilesToExplode[b]
      const tile_value = board[y][x]

      if (tile_value > 0 && tile_value < 5) {
        board[y][x] = 50
      } else if (tile_value === 5) {
        let tileValues = [2,3,50,50,50,50,50,50,50]
        board[y][x] = 50
        const newPower = shuffle(tileValues)[0]
        if (newPower === 2 || newPower ===3) {
          const powerUp = {x: x, y: y,  value: newPower}
          this.handleSendState(powerUp, 'powerUp')
        }
      } else if (tile_value > 10 && tile_value < 50) {
        if ( x !== bomb.x || y !== bomb.y) {
              const newBomb = {x, y, value: tile_value}
              chainedBombs.push(Object.assign({}, newBomb))
            }
        board[y][x] = 50
      } else {
        board[y][x] += 1
      }

    } //end for
    let players = [...this.state.players]
    players[bombDetails.playerNum - 1].bombs += 1
    this.setState({board, players}, () => {
      this.postExplode(tilesToExplode, chainedBombs)
      this.handleSendState
    })
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

  postExplode = (tilesToReset, chainedBombs) => {
    const isDead = this.isPlayerDead(tilesToReset)
    setTimeout(() => this.resetTiles(tilesToReset), 1000)
    for (let b = 0; b < chainedBombs.length; b++) {
      setTimeout(() => this.explodeBomb(chainedBombs[b]), 100)
    }
  }

  resetTiles = (tilesToReset) => {

    let board = [...this.state.board]
    for (let b = 0; b < tilesToReset.length; b++) {
      const {x, y} = tilesToReset[b]
      if (board[y][x] === 50) {
        board[y][x] = 1
      } else if (board[y][x] > 50) {
        board[y][x] -= 1
      }
    }
    this.setState({board}, this.handleSendState)
  }

  generateBlocks = () => {
    let blockCount = 75
    let board = [...this.state.board]
    let notBlocks = []
    this.state.players.forEach((player) => {
      notBlocks.push(`${player.x},${player.y}`)
      notBlocks.push(`${player.x-1},${player.y}`)
      notBlocks.push(`${player.x+1},${player.y}`)
      notBlocks.push(`${player.x},${player.y+1}`)
      notBlocks.push(`${player.x},${player.y-1}`)
    })

    while(blockCount > 0){
      board.forEach((row, rowIndex) => {
        row.forEach((tile, columnIndex) => {
          const coordinates = `${columnIndex},${rowIndex}`
          if(!notBlocks.includes(coordinates) && board[rowIndex][columnIndex] !== 0 && Math.round(Math.random() * 1)){
            board[rowIndex][columnIndex] = 5
            blockCount -= 1
          }
        })
      })
    }

    this.handleSendState(board, 'board')
  }

  checkPlayers = (players, playerId) => {
    for (let i = 0 ; i < players.length; i++ ) {
      if(players[i].player_id === playerId) {
        return true
      }
    }
    return false
  }

  // adds players based on the number of players existing
  handleClick = (event) => {
    event.preventDefault()

    if(this.myPlayer() || this.state.players.length >= 4) return

    const index = this.state.players.length
    const array = [{x: 1, y: 1}, {x: 11, y: 1}, {}]
    const startingCrd = array[index]
    let newState = {...this.state}
    const colors = ['white', 'blue', 'green', 'gray']
    if (!this.checkPlayers(this.state.players, this.player_id)) {
      newState.players = newState.players.filter(player => !!player.x)
      newState.players.push({player: index+1, ...startingCrd, isAlive: true, color: colors[index], player_id: this.player_id, blast:1, bombs: 1 })
    }
    console.log(newState.players, 'onClick')
    this.handleSendState(newState.players, 'players')

  }

  startGame = (event) => {
    event.preventDefault()
    let newState = {...this.state}
    const array = [{x: 1, y: 1}, {x: 11, y: 1}, {x: 1, y: 13}, {x: 11, y: 13}]
    newState.players.forEach((player, index) => {
      player.x = array[index].x
      player.y = array[index].y
      player.isAlive = true
    })
    newState.board = [...initBoard]
    this.generateBlocks()
  }

  render(){
    return(
      <div>
        <h1>Hackerman</h1>
        <h3>HACK OR BE HACKED</h3>
        <JoinButton onClick={this.handleClick}/>
        <StartButton onClick={this.startGame}/>
        <BoardView board={this.state.board} players={this.state.players} timeExplode={this.timerGoOff}/>

      </div>
    )
  }
}

export default Game

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a
}
