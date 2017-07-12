import React from 'react'
import './gameboard.css'
import Character from './character'
import Bomb from './bomb'
import {Icon} from 'semantic-ui-react'

class GameBoard extends React.Component {

  isTile = (tileValue, rowIndex, columnIndex) => {
    if (rowIndex === this.props.character.y && columnIndex === this.props.character.x && tileValue !== 0) {
      return (
        <div>
          <Character />

        </div>
      )
    }
    if(tileValue === 1){
      return (
        <td className='tile activeTile'>
        </td>
      )
    } else if(tileValue === 2){
      return (
        <td className='tile activeTile'>
          <Bomb explode={this.props.explode} />
        </td>
      )
    } else if(tileValue === 3){
      return (
        <td className='tile activeTile'>
          <Icon name='fire' size='large'/>
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
