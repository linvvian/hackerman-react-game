import React from 'react'
import { Button } from 'semantic-ui-react'

const StartButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>Start Game</Button>
  )
}

export default StartButton
