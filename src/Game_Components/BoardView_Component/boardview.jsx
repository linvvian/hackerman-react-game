import React from 'react'
import './boardview.css'
import Character from '../Character_Component/character'
import Bomb from '../Bomb_Component/bomb'
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
      if (!!this.props.players.reduce(function(a,b){return a.x === b.x && a.y===b.y ? a : NaN})) {
        return (
          <td>
            <Character color={this.props.players[0].color}/>
          </td>
        )
      }
      return this.props.players.map((player) => {
        if (rowIndex === player.y && columnIndex === player.x && player.isAlive) {
          return (
            <td>
              <Character color={player.color}/>
            </td>
          )
        }
      })
    }
  }

  render(){
    return(
      <table>
        <tbody>
        {this.props.board.map((row, indexRow) => {
          return (
            <tr>
              {row.map((tile, indexColumn) => {
                return this.isTile(tile, indexRow, indexColumn)
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }
}

export default BoardView
