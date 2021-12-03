// an object to have the gameboard and everything related to checking it in one place
let Gameboard = (() => {
    let gameboard = [];

    function checkForWin(mark) {
        for (let i = 0; i < 9; i += 3) {
            if (gameboard[i] ===  mark && gameboard[i + 1] ===  mark && gameboard[i + 2] === mark) {
                return true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameboard[i] === mark && gameboard[i + 3] === mark && gameboard[i + 6] === mark) {
                return true;
            }
        }
        if (gameboard[0] === mark && gameboard[4] === mark && gameboard[8] === mark){
            return true;
        }
        if (gameboard[2] ===  mark && gameboard[4] ===  mark && gameboard[6] === mark) {
            return true;
        }
        return false;
    }

    function checkForDraw() {
        for (let i = 0; i < 9; i++) {
            if (gameboard[i] === undefined) {
                return false;
            }
        }
        return true;
    }

    function reset() {
        gameboard = [];
        //console.log(gameboard)
    }

    function change(index, mark) {
        gameboard[index] = mark;
    }

    function checkEmptiness(index) {
        if (gameboard[index] === undefined) {
            return true;
        } else {
            return false;
        }
    }

    function getGameboard() {
        return gameboard
    }

    return {change, checkForWin, checkForDraw, reset, getGameboard, checkEmptiness};
})()

// for creating a player object and then creating a list of players for later use
let Player = function(mark) {

    function play(index) {
        if (Gameboard.checkEmptiness(index)) {
            Gameboard.change(index, mark);
            return true;
        } else {
            return false;
        }
    }
    return {play, mark};
}

let player1 = Player('X');
let player2 = Player('O');
let players = [player1, player2]

//a game controller
let turn = (() => {
    let player = players[0];

    function next() {
        if (player === players[0]) {
            player = players[1];
        } else {
            player = players[0];
        }
    }

    function reset() {
        player = players[0];
    }

    function getCurrentPlayer() {
        return player
    }

    return {getCurrentPlayer, next, reset}
}) ();


let gameUi = document.querySelector('.game-ui');
let spaces = document.querySelectorAll('td[data-index]');

//rendering the gameboard to the 

function renderUi(gameboard) {
    spaces.forEach(space => {
        //console.log(gameboard[space.getAttribute('data-index')])
        space.textContent = gameboard[space.getAttribute('data-index')];
    })
    //console.log(gameboard);
}
renderUi(Gameboard.getGameboard());

// starting ui functionality
let uiInfo = function() {
    let startingUi = document.querySelector('.starting-ui');
    let nameInputs = startingUi.querySelectorAll('.name-input');
    let playButton = startingUi.querySelector('.submit');
    let turnAnouncer = document.querySelector('.turn-anouncer');
    let errorMessage = startingUi.querySelector('.error');
    let finishingUi = document.querySelector('.finishing-ui');
    let winnerAnouncer = finishingUi.querySelector('.winner-anouncer');
    let resetButton = finishingUi.querySelector('.restart-button');
    let player1Name;
    let player2Name;

    playButton.onclick = function() {
        if (nameInputs[0].value === '' || nameInputs[1].value === '') {
            errorMessage.textContent = "you need to enter both names";
            return;
        }
        player1Name = nameInputs[0].value;
        player2Name = nameInputs[1].value;
        document.querySelector('.player1-name').textContent = `X : ${player1Name}`;
        document.querySelector('.player2-name').textContent = `O : ${player2Name}`;
        turnAnouncer.textContent = 'X';
        startingUi.remove();
    };

    function anounceNext() {
        if (turnAnouncer.textContent === 'X') {
            turnAnouncer.textContent = 'O';
        } else {
            turnAnouncer.textContent = 'X';
        }
    }

    function getPlayer1Name() {
        return player1Name;
    }

    function getPlayer2Name() {
        return player2Name;
    }

    function showFinishingUi() {
        finishingUi.classList.add('active');
    }

    function anounceWinner(name) {
        winnerAnouncer.textContent = `Winner is : ${name}`;
    }

    //adding restart button functionality
    resetButton.addEventListener('click',() => {
        gameFlow.activeGame();
        finishingUi.classList.remove('active');
    })

    

    return {getPlayer1Name, getPlayer2Name, anounceNext, showFinishingUi, anounceWinner};
} ()

//controling the activation or deactivation of gameboard

let gameFlow = (() => { 
    let turnAnouncer = document.querySelector('.turn-anouncer');
    function activeGame() {
        spaces.forEach(space => {
            space.addEventListener('click', gameplay, {once: true})
        })
    }
    function gameplay(event) {
        let winner;
        //console.log(this)
        let played = turn.getCurrentPlayer().play(event.target.getAttribute('data-index'));
        renderUi(Gameboard.getGameboard());
        //console.log(Gameboard.gameboard);
        //console.log(Gameboard.gameboard);
        //console.log(event.target.getAttribute('data-index'))
        if (Gameboard.checkForWin(turn.getCurrentPlayer().mark)) {
            turnAnouncer.textContent = 'X';
            //console.log('win');
            Gameboard.reset();
            setTimeout(renderUi, 1000, Gameboard.getGameboard());
            deactiveGame();
            uiInfo.showFinishingUi();
            if (turn.getCurrentPlayer().mark === 'X'){
                console.log(uiInfo.getPlayer1Name());
                uiInfo.anounceWinner(uiInfo.getPlayer1Name());
            } else {
                console.log(uiInfo.getPlayer2Name());
                uiInfo.anounceWinner(uiInfo.getPlayer2Name());
            }
            turn.reset();
            //console.log(Gameboard.gameboard);
        } else if (Gameboard.checkForDraw()) {
            turnAnouncer.textContent = 'X';
            //console.log('draw');
            Gameboard.reset();
            setTimeout(renderUi, 1000, Gameboard.getGameboard());
            deactiveGame();
            uiInfo.showFinishingUi();
            uiInfo.anounceWinner()
            turn.reset();
            //console.log(Gameboard.gameboard);
        } else {
            if (played) {
                turn.next();
                uiInfo.anounceNext();
            }
        }
    }

    activeGame()
    
    //making the gameboard inactive
    
    function deactiveGame() {
        spaces.forEach(space => {
            space.removeEventListener('click', gameplay, {once: true})
        })
    }
    return {activeGame, deactiveGame}
}) ()




































