//   create a game object so we can have all the play functions and win checking in it
const gameObj = (() => {
  
  let gameArray = []
  let player_x;
  let player_o;
  let turn;
  const game = document.querySelector('.game')

  //function for changing the turn
  function nextTurn() {
    if (turn === player_x) {
      turn = player_o
    } else if (turn === player_o) {
      turn = player_x
    }
  }

  // reset te game array whenever nedded
  function resetGameArray() {
    gameArray = []
    for (let i = 0; i < 9; i++ ) {
      gameArray.push('')
    }
  }

  // initialize the game array and game obj
  let initTheGame = () => {
    resetGameArray()
    turn = player_x;
    for (let i = 0; i < 9; i++) {
      let gameBlock = document.createElement('div')
      gameBlock.classList.add('game-block', `block-${i}`)
      gameBlock.textContent = gameArray[i]
      game.appendChild(gameBlock)
      gameBlock.addEventListener('click', function(e) {
        play(e.target, i)
      }, {once: true})
    }
  }

  function play(gameBlock, index) {
    gameBlock.textContent = turn.mark
    gameArray[index] = turn.mark
    nextTurn()
  }

  // player factory function
  function Player(name, type) {
    return {name, type}
  }


  function setPlayerX(name, type) {
    player_x = Player(name, type)
    player_x.mark = 'X'
  }

  function setPlayerO(name, type) {
    player_o = Player(name, type)
    player_o.mark = 'O'
  }

  setPlayerX('Alireza', 'p')
  setPlayerO('amir', 'p')
  /*
  // play a move with given mark
  let play = (mark, index) => {
    gameArray[index] = mark
    let gameBlock = game.querySelector(`:nth-child(${index + 1})`)
    gameBlock.textContent = mark
  }
  */


  return {initTheGame}
})()

gameObj.initTheGame()































