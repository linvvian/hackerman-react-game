import React from 'react'
import './gameboard.css'
import Character from './character'
import Bomb from './bomb'

class GameBoard extends React.Component {

  isTile = (tileValue, rowIndex, columnIndex) => {
    if (rowIndex === this.props.character.y && columnIndex === this.props.character.x) {
      return (
        <div>
          <Character />
        </div>
      )
    }
    if(tileValue === 1){
      return (
        <td id={`cell-${rowIndex}-${columnIndex}`} className='tile activeTile'>
          <Bomb bombState={{'visibility': 'hidden'}}/>
        </td>
      )
    }
    else {
      return (
        <td id={`cell-${rowIndex}-${columnIndex}`} className='tile nonTile'>
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

export default GameBoard
