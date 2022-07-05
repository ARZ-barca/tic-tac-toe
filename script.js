const gameObj = (() => {
  const game = document.querySelector('.game')
  let gameBlocksArray;
  let gameArray = [];

  // an object for determining the turn and make ai play it's turn
  const turn = {init() {
      this.mark = 'X'
      let playerX = playerSelection.getXplayer()
      if (playerX.type !== 'ai') {
        return
      }
      move = playerX.getMove()
      aiPlay(move)
    },
    next() {
      if (this.mark === 'X') {
        this.mark = 'O'
        let playerO = playerSelection.getOplayer()
        if (playerO.type !== 'ai') {
          return
        }
        move = playerO.getMove()
        aiPlay(move)
      } else if (this.mark === 'O') {
        this.mark = 'X'
        let playerX = playerSelection.getXplayer()
        if (playerX.type !== 'ai') {
          return
        }
        move = playerX.getMove()
        aiPlay(move)
      }
    }, 
    getCurrentTurn() {
      return this.mark
    }
  }

  // fill the game object with game blocks and fill the game array with empty string
  let init = () => {
    gameArray = []
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
    turn.init()
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
    let result = check(gameArray);
    if (result) {
      endGame(result)
    } else {
      turn.next()
    } 
    
  }

  // check for win or draw
  let check =  (gameArray) => {
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
    return emptyIndexes
  }

  let getGameArrayCopy = () => {
    return JSON.parse(JSON.stringify(gameArray))
  }
  
  return {init, addEventListeners, aiPlay, check, getEmptyIndexes, getGameArrayCopy, turn}
}) ()

const players = (() => {
  // a function to create human player
  let HumanPlayer = (name) => {
    return {name}
  }

  let LoserAi = () => {
    let name = 'loser'
    let type = 'ai'
    let move;
    let getMove = () => {
      let emptyIndexes = gameObj.getEmptyIndexes()
      let gameArrayCopy = gameObj.getGameArrayCopy()
      if (emptyIndexes.length === 1) {
        move = emptyIndexes[0]
        return move
      }
      while (true) {
        move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
        gameArrayCopy[move] = gameObj.turn.getCurrentTurn()
        let result = gameObj.check(gameArrayCopy)
        if (result === 'X' || result === 'O') {
          gameArrayCopy[move] = ''
          continue
        } 
        break
      }
      return move
    }
    return {name, type, getMove}
  }

  return {HumanPlayer, LoserAi}
}) ()

const playerSelection = (() => {
  let player_x, player_o;
  // functions to set and get x and o players
  function setXplayer(player) {
    player_x = player
    let playerLabelx = document.querySelector('.x-player .name')
    playerLabelx.textContent = player.name
  }

  function setOplayer(player) {
    player_o = player
    let playerLabelo = document.querySelector('.o-player .name')
    playerLabelo.textContent = player.name
  }

  function getXplayer() {
    return player_x
  }

  function getOplayer() {
    return player_o
  }


  // selecting a player

  let playerXLabel = document.querySelector('.x-player')
  let playerOLabel = document.querySelector('.o-player')

  playerXLabel.addEventListener('click', addActive)
  playerOLabel.addEventListener('click', addActive)

  playerXLabel.addEventListener('mouseleave', removeActive)
  playerOLabel.addEventListener('mouseleave', removeActive)

  function addActive(e) {
    this.classList.add('active')
  }

  function removeActive(e) {
    this.classList.remove('active')
  }

  // selecting a human player
  let humanLabelX = document.querySelector('.x-player .human-player')
  let humanLabelO = document.querySelector('.o-player .human-player')
  
  humanLabelX.addEventListener('click', selectHumanPlayerX)
  humanLabelO.addEventListener('click', selectHumanPlayerO)

  function selectHumanPlayerX(e) {
    let name = prompt('enter the player name:')
    if (name === null || name === '') {
      return
    }
    let player = players.HumanPlayer(name)
    setXplayer(player)
    checkPlayerSelection()
  }

  function selectHumanPlayerO(e) {
    let name = prompt('enter the player name:')
    if (name === null || name === '') {
      return
    }
    let player = players.HumanPlayer(name)
    setOplayer(player)
    checkPlayerSelection()
  }

  let loserAiX = document.querySelector('.x-player .loser')
  let loserAiO = document.querySelector('.o-player .loser')

  loserAiX.addEventListener('click', selectLoserX) 
  loserAiO.addEventListener('click', selectLoserO)

  function selectLoserX() {
    setXplayer(players.LoserAi())
    checkPlayerSelection()
  }

  function selectLoserO() {
    setOplayer(players.LoserAi())
    checkPlayerSelection()
  }

  function checkPlayerSelection() {
    if (player_x !== undefined && player_o !== undefined) {
      runGame()
    }
  }

  return {setOplayer, setXplayer, getXplayer, getOplayer}
}) ()

// main functions

function runGame() {
  let game = document.querySelector('.game')
  game.innerHTML = ''
  let resultDiv = document.createElement('div')
  resultDiv.classList.add('result');
  game.appendChild(resultDiv)
  gameObj.init()
  gameObj.addEventListeners()
}

function endGame(result) {
  let resultDiv = document.querySelector('.result')
  resultDiv.classList.add('show')
  if (result === 'draw') {
    resultDiv.textContent = 'draw'
  } else if (result === 'X') {
    resultDiv.textContent = `${playerSelection.getXplayer().name} won!`
  } else if (result === 'O') {
    resultDiv.textContent = `${playerSelection.getOplayer().name} won!`
  }
}

let resetButton = document.querySelector('.reset')
resetButton.addEventListener('click', (e) => {
  runGame()
})


//main.runGame()






