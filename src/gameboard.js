import React from 'react'
import './gameboard.css'
import Character from './character'
import Bomb from './bomb'
import {Icon} from 'semantic-ui-react'

class BoardView extends React.Component {

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
        <td className='tile activeTile'>
        </td>
      )
    } else if(tileValue === 2){
      return (
        <td className='tile activeTile'>
          <Bomb timeExplode={this.props.timeExplode} tile={{x:columnIndex, y:rowIndex}} />
        </td>
      )
    } else if(tileValue > 2){
      return (
        <td className='tile activeTile'>
          <Icon name='fire' />
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

export default BoardView
