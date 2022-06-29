const gameObj = (() => {
  const game = document.querySelector('.game')
  let gameBlocksArray;
  let gameArray = [];

  // an object for determining the turn
  const turn = {mark: 'X', next() {
    if (this.mark === 'X') {
      this.mark = 'O'
    } else if (this.mark === 'O') {
      this.mark = 'X'
    }
  }}

  // fill the game object with game blocks and fill the game array with empty string
  let init = () => {
    for (let i = 0; i < 9; i++) {
      let gameBlock = document.createElement('div')
      gameBlock.classList.add('game-block')
      gameBlock.setAttribute('data-index', `${i}`)
      game.appendChild(gameBlock)
      gameArray.push('')
    }
    gameBlocksArray = [...document.querySelectorAll('.game-block')]
  }

  // adds event listener to game blocks
  let addEventListeners = () => {
    turn.mark = 'X'
    for (let i = 0; i < 9; i++) {
      let gameBlock = gameBlocksArray[i]
      gameBlock.addEventListener('click', clickPlay, {once: true})
    }
  }

  function clickPlay(e) {
    play(+(e.target.getAttribute('data-index')))
  }

  // plays an ai move
  let aiPlay = (move) => {
    play(move)
    gameBlocksArray[move].removeEventListener('click', clickPlay, {once: true})
  }

  function play(move) {
    let block = gameBlocksArray[move]
    block.textContent = turn.mark
    gameArray[move] = turn.mark
    let result = check(game);
    if (result) {
      endGame(result)
    }
    turn.next() 
  }

  // check for win or draw
  let check =  () => {
    // horizontal check
    if (gameArray[0] === gameArray[1] && gameArray[0] === gameArray[2] && gameArray[0] !== '') return gameArray[0];
    if (gameArray[3] === gameArray[4] && gameArray[3] === gameArray[5] && gameArray[3] !== '') return gameArray[3];
    if (gameArray[6] === gameArray[7] && gameArray[6] === gameArray[8] && gameArray[6] !== '') return gameArray[6];
    // vertical check
    if (gameArray[0] === gameArray[3] && gameArray[0] === gameArray[6] && gameArray[0] !== '') return gameArray[0];
    if (gameArray[1] === gameArray[4] && gameArray[1] === gameArray[7] && gameArray[1] !== '') return gameArray[1];
    if (gameArray[2] === gameArray[5] && gameArray[2] === gameArray[8] && gameArray[2] !== '') return gameArray[2];
    // diagonal check
    if (gameArray[0] === gameArray[4] && gameArray[0] === gameArray[8] && gameArray[0] !== '') return gameArray[0];
    if (gameArray[2] === gameArray[4] && gameArray[2] === gameArray[6] && gameArray[2] !== '') return gameArray[2];

    let draw = true;
    for (let i = 0; i < 9; i++) {
      if (gameArray[i] === '') {
        draw = false;
      }
    }
    if (draw) return 'draw';
    return false;
  }

  // returns empty indexes of the gameArray
  let getEmptyIndexes = () => {
    let emptyIndexes = []
    for (let i = 0; i < 9; i++) {
      if (gameArray[i] === '') {
        emptyIndexes.push(i)
      }
    }
  }
  
  return {init, addEventListeners, aiPlay, check, getEmptyIndexes}
}) ()

const players = (() => {

  let player_x, player_o;

  // a function to create human player
  let HumanPlayer = (name) => {
    return {name}
  }


  // functions to set x and o players
  function setXplayer(player) {
    player_x = player
  }

  function setOplayer(player) {
    player_o = player
  }

  function createAi(name, algo) {
    return {name, algo}
  }

  function loserAlgo(emptyIndexes) {
    
  }

  return {HumanPlayer, setXplayer, setOplayer}
}) ()

let player1 = players.HumanPlayer('alireza')
let player2 = players.HumanPlayer('amir')

function runGame() {
  document.querySelector('.game').innerHTML = ''
  gameObj.init()
  gameObj.addEventListeners()
  players.setXplayer(player1)
  players.setOplayer(player2)
}

runGame()

function endGame(result) {
  console.log(result)
}








