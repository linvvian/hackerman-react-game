import React from 'react'
import './gameboard.css'
import Character from './character'
import Bomb from './bomb'
import {Icon} from 'semantic-ui-react'

class BoardView extends React.Component {

  isTile = (tileValue, rowIndex, columnIndex) => {
    const coords = this.props.players.map((player) => {
      return `${player.x},${player.y}`
    })
    const currentCoord = `${columnIndex},${rowIndex}`
    if(tileValue === 1 && !coords.includes(currentCoord)){
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
    } else if(tileValue === 0){
      return (
        <td className='tile nonTile'>
        </td>
      )
    } else {
      return this.props.players.map((player) => {
        if (rowIndex === player.y && columnIndex === player.x) {
          return (
            <div>
              <Character color={player.color}/>
            </div>
          )
        }
      })
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
