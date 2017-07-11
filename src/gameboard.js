import React from 'react'
import './gameboard.css'
import Character from './character'

class GameBoard extends React.Component {

  isTile = (tileValue, rowIndex, columnIndex) => {
    if (rowIndex === this.props.character.y && columnIndex === this.props.character.x && tileValue !== 0) {
      return <Character />
    }
    if(tileValue === 1){
      return (
        <td className='tile activeTile'>
        </td>
      )
    }
    else {
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

export default GameBoard
