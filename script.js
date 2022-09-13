const GameBoard = (() => {
    const gameState = [
        [[],[],[]],
        [[],[],[]],
        [[],[],[]]
    ];

    function updateBoard(lastPlayer) {
        const cells = document.getElementsByClassName("cell");
        for(i = 0; i < cells.length; i++) {
            const pos = cells[i].getAttribute("data-pos");
            const [x, y] = pos.split('|');
            gameState[y][x] = cells[i].textContent;
        }
        checkWinner(lastPlayer);
    }
    
    function checkWinner(lastPlayer) {
        if(gameState[0][0] != "" && gameState[0][0] == gameState[0][1] && gameState[0][1] == gameState[0][2] ||
            gameState[1][0] != "" && gameState[1][0] == gameState[1][1] && gameState[1][1] == gameState[1][2] ||
            gameState[2][0] != "" && gameState[2][0] == gameState[2][1] && gameState[2][1] == gameState[2][2] ||
            gameState[0][0] != "" && gameState[0][0] == gameState[1][0] && gameState[1][0] == gameState[2][0] ||
            gameState[0][1] != "" && gameState[0][1] == gameState[1][1] && gameState[1][1] == gameState[2][1] ||
            gameState[0][2] != "" && gameState[0][2] == gameState[1][2] && gameState[1][2] == gameState[2][2] ||
            gameState[0][0] != "" && gameState[0][0] == gameState[1][1] && gameState[1][1] == gameState[2][2] ||
            gameState[0][2] != "" && gameState[0][2] == gameState[1][1] && gameState[1][1] == gameState[2][0]
            ){
            lastPlayer.increaseScore();
            GameFlow.displayResults(lastPlayer);
        } else {
            for(let y = 0; y < 3; y++) {
                for(let x = 0; x < 3; x++) {
                    if(gameState[y][x] == '') {
                        return;
                    }

                }
            }
            GameFlow.displayResults('tie');
        }
    }

    function reset() {
        const cells = document.getElementsByClassName("cell");
        for(i = 0; i < cells.length; i++) {
            cells[i].textContent = '';
        }
    }

    return {
        updateBoard, reset
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
    let otherPlayer;
    let firstPlayer;
    let secondPlayer;

    function start() {
        showForm();
    }

    function showForm() {
        const getPlayerForm = document.getElementById("playerCreator");
        getPlayerForm.style.display = "block";
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
                }
                else {
                    player2Tile.textContent = `Your tile is: X`
                    player2Tile.setAttribute("data-tile", 'X');
                }
            }
            else {
                const name = document.getElementById("playerName").value;
                const tile = document.getElementById("player2Tile").getAttribute("data-tile");
                secondPlayer = Player(name, tile);
                if(secondPlayer.tile == 'X') {
                    currentPlayer = secondPlayer;
                    otherPlayer = firstPlayer;
                }
                else {
                    currentPlayer = firstPlayer;
                    otherPlayer = secondPlayer;
                }
                getPlayerForm.style.display = "none";
                document.getElementById("playerCreatorSubmitButton").disabled = true;
                createGame();
            }
        }
        
    }

    function createGame() {
        const scoreBoard = document.getElementById("scoreBoard");
        scoreBoard.textContent = `${firstPlayer.name}: ${firstPlayer.getScore()} | ${secondPlayer.name}: ${secondPlayer.getScore()}`;
        const playerTracker = document.getElementById("currentPlayer");
        playerTracker.textContent = `Current player: ${currentPlayer.name} | Tile: ${currentPlayer.tile}`;
        createBoard();
    }
    //createBoard() makes buttons in the DOM and attaches listeners to them
    function createBoard() {
        const playArea = document.getElementById("playArea");
        const board = document.createElement("div");
        board.id = "gameBoard";
        for(let y = 0; y < 3; y++) {
            for(let x = 0; x < 3; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("data-pos", `${x}|${y}`);
                cell.addEventListener("click", tileClickListener);
                board.appendChild(cell);
            }
        }
        playArea.appendChild(board);
    }
    //updateGame() updates current player field in html
    function updateGame() {
        const scoreBoard = document.getElementById("scoreBoard");
        scoreBoard.textContent = `${firstPlayer.name}: ${firstPlayer.getScore()} | ${secondPlayer.name}: ${secondPlayer.getScore()}`;
        const playerTracker = document.getElementById("currentPlayer");
        playerTracker.textContent = `Current player: ${currentPlayer.name} | Tile: ${currentPlayer.tile}`;
    }
    //tileClickListener() attempts to place a mark on selected tile, updates currentPlayer and calls updateGame(), or fails and does nothing
    function tileClickListener() {
        if(this.textContent == ""){
            this.textContent = currentPlayer.tile;
            [currentPlayer, otherPlayer] = [otherPlayer, currentPlayer];
            updateGame();
            GameBoard.updateBoard(otherPlayer);
        }
    }

    function displayResults(winner) {
        const resultsWindow = document.getElementById("winnerDisplay");
        resultsWindow.style.display = "block"; 
        const resultsName = document.getElementById("winnerName");
        if(winner == 'tie') {
            resultsName.textContent = "It's a Tie!";
        } else {
            resultsName.textContent = `Congrats ${winner.name}, You've Won!`;
        }
        updateGame();
    }

    function closeDisplayResults() {
        const resultsWindow = document.getElementById("winnerDisplay");
        resultsWindow.style.display = "none"; 
        GameBoard.reset();
    }

    const nameSubmitButton = document.getElementById("playerCreatorSubmitButton");
    nameSubmitButton.addEventListener("click", addPlayers);
    const winnerSubmitButton = document.getElementById("winnerDisplaySubmitButton")
    winnerSubmitButton.addEventListener("click", closeDisplayResults);

    return { start, displayResults };
})();

GameFlow.start();
