export default class KeyListener {


  isDown = (keyCode) => {
    return this.keys[keyCode] || false
  }



  unsubscribe = () => {
    window.removeEventListener('keydown', this.down)
    window.removeEventListener('keyup', this.up)
    this.keys = {}
  }

  constructor() {

  }

}
