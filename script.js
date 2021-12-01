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

    return {gameboard, checkForWin, checkForDraw, reset};
})()

// for creating a player object and then creating a list of players for later use
let Player = function(mark) {

    function play(x, gameboard) {
        if (gameboard[x] === undefined || gameboard === '') {
            gameboard[x] = mark;
        }
    }

    return {play, mark};
}

let player1 = Player('X');
let player2 = Player('O');
let players = [player1, player2]

//a game controller
let turn = ((players) => {
    let player = players[0];

    function next() {
        if (player === players[0]) {
            player = players[1];
        } else {
            player = players[0];
        }
    }

    return {player, next}
}) (players);


let gameUi = document.querySelector('.game-ui');
let spaces = document.querySelectorAll('td[data-index]');

function renderUi(gameboard) {
    spaces.forEach(space => {
        //console.log(gameboard[space.getAttribute('data-index')])
        space.textContent = gameboard[space.getAttribute('data-index')];
    })
    //console.log(gameboard);
}
renderUi(Gameboard.gameboard);

spaces.forEach(space => {
    space.addEventListener('click', event => {
        turn.player.play(event.target.getAttribute('data-index'), Gameboard.gameboard);
        renderUi(Gameboard.gameboard);
        console.log(Gameboard.gameboard)
        //console.log(event.target.getAttribute('data-index'))
        if (Gameboard.checkForWin(turn.player.mark)) {
            Gameboard.reset()
        } else if (Gameboard.checkForDraw()) {
            Gameboard.reset()
        }
        turn.next()
    })
})