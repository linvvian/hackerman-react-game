import React from 'react'
import './boardview.css'
import Character from '../Character_Component/character'
import Bomb from '../Bomb_Component/bomb'
import Block from '../Block_Component/block'
import {Icon} from 'semantic-ui-react'

class BoardView extends React.Component {

  isCharacter = (coords, currentCoord) => {
    const index = coords.indexOf(currentCoord)
    if (coords.includes(currentCoord)) {
      return <Character color={this.props.players[index].color}/>
    }
  }

  isTile = (tileValue, rowIndex, columnIndex) => {
    const coords = this.props.players.map((player) => {
      return `${player.x},${player.y}`
    })
    const currentCoord = `${columnIndex},${rowIndex}`
    if(tileValue === 1){
      return (
        <td className='tile activeTile'>
          {this.isCharacter(coords, currentCoord)}
        </td>
      )
    } else if(tileValue === 5){
      return (
        <td className='tile activeTile'>
          <Block />
        </td>
      )
    } else if(tileValue === 3 || tileValue === 2){
      return (
        <td className='tile activeTile'>
          powerUp
        </td>
      )
    } else if(tileValue > 5 && tileValue < 11){
      return (
        <td className='tile activeTile'>
          <Bomb timeExplode={this.props.timeExplode} tile={{x:columnIndex, y:rowIndex}} />
        </td>
      )
    } else if(tileValue > 10){
      return (
        <td className='tile activeTile'>
          <Icon name='fire' />
        </td>
      )
    } else {
      return (
        <td className='tile nonTile'>
        </td>
      )
    }
  }

  render(){
    return(
      <table>
        {this.props.board.map((row, indexRow) => {
          return (
            <tr>
              {row.map((tile, indexColumn) => {
                return this.isTile(tile, indexRow, indexColumn)
              })}
            </tr>
          )
        })}
      </table>
    )
  }
}

export default BoardView
