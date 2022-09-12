const GameBoard = (() => {
    //reset() sets gameState to blank board
    //checkWinner() checks for winner or tie, returns 'X', 'O', 'TIE', or 'CONTINUE'
    const gameState = [
        [['X'],['O'],['X']],
        [['X'],[],['O']],
        [['O'],['X'],['O']]
    ];
    return {
        gameState
    };
})();

const Player = (name, tile) => {
    let score = 0;

    function getScore() { return score; }

    function increaseScore() { score++; }

    return { name, tile, getScore, increaseScore };
};

const GameFlow = (() => {
    let currentPlayer;
    let firstPlayer;
    let secondPlayer;

    function start() {
        showForm();
    }

    function showForm() {
        const getPlayerForm = document.getElementById("playerCreator");
        getPlayerForm.style.display = "block";
        const formSubmitButton = document.getElementById("playerCreatorSubmitButton");
        formSubmitButton.addEventListener("click", addPlayers);
    }

    function addPlayers() {
        const getPlayerForm = document.getElementById("playerCreator");
        const valid = getPlayerForm.checkValidity();
        if(valid) {
            if(firstPlayer == undefined) {
                const name = document.getElementById("playerName").value;
                const tile = document.querySelector("[name='tile']:checked").value;
                firstPlayer = Player(name, tile);
                document.getElementById("playerName").value = "";
                document.getElementById("tileSelector").style.display = "none";

                //currentPlayer starts as 'X'
                player2Tile = document.getElementById("player2Tile");
                if(tile == "X"){
                    player2Tile.textContent = `Your tile is: O`
                    player2Tile.setAttribute("data-tile", 'O');
                    currentPlayer = firstPlayer;
                }
                else {
                    player2Tile.textContent = `Your tile is: X`
                    player2Tile.setAttribute("data-tile", 'X');
                    currentPlayer = secondPlayer;
                }
            }
            else {
                const name = document.getElementById("playerName").value;
                const tile = document.getElementById("player2Tile").getAttribute("data-tile");
                secondPlayer = Player(name, tile);
                const getPlayerForm = document.getElementById("playerCreator");
                getPlayerForm.style.display = "none";
                document.getElementById("playerCreatorSubmitButton").disabled = true;
                createGame(firstPlayer, secondPlayer);
            }
        }
        
    }
    //createGame(player1, player2) calls createBoard(), populates scoreboard, and sets currentPlayer to the player with the 'X' tile
    function createGame(player1, player2) {

    }
    //createBoard() makes buttons in the DOM and attaches listeners to them
    //updateGame() calls updateBoard() and updates current player field in html
    //updateBoard() updates buttons to show current value
    //tileClickListener() attempts to place a mark on selected tile, updates currentPlayer and calls updateGame(), or alerts and retries
    return { start };
})();

GameFlow.start();

//const me = Player("Trever", 'X');