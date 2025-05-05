/* 
 * Gameboard Module (IIFE)
 * Manages the game board state and operations
 */
const Gameboard = (() => {
    // Private game board array (index 0-8 represents 3x3 grid)
    const board = ["", "", "", "", "", "", "", "", ""];

    // Returns current board state
    const getBoard = () => board;

    // Places player token at specified index
    const dropToken = (index, token) => {
        board[index] = token;
    };

    // Resets all board cells to empty
    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    // Checks if specified cell is empty
    const checkCell = (index) => board[index] === "";

    // Debugging utility to print board state
    const printBoard = () => {
        console.log(`
            ${board[0]} ${board[1]} ${board[2]}

            ${board[3]} ${board[4]} ${board[5]}
            
            ${board[6]} ${board[7]} ${board[8]}
        `);
    };

    return { getBoard, dropToken, resetBoard, checkCell, printBoard };
})();

/* 
 * Player Factory
 * Creates player objects with name and marker
 */
function Player(name, marker) {
    return { name, marker };
}

/* 
 * Game Controller
 * Manages game logic, player turns, and game state
 */
function gameController() {
    const gameboard = Gameboard;
    const board = gameboard.getBoard();
    const playerOne = Player("Player 1", "X");
    const playerTwo = Player("Player 2", "O");
    let activePlayer = playerOne;
    let gameOver = false;

    // Resets game state for new game
    const resetGame = () => {
        gameboard.resetBoard();
        activePlayer = playerOne;
        gameOver = false;
    };

    // Checks if current player has winning combination
    const checkWin = () => {
        const currentMarker = activePlayer.marker;
        return (
            // Horizontal wins
            (board[0] === currentMarker && board[1] === currentMarker && board[2] === currentMarker) ||
            (board[3] === currentMarker && board[4] === currentMarker && board[5] === currentMarker) ||
            (board[6] === currentMarker && board[7] === currentMarker && board[8] === currentMarker) ||
            // Vertical wins
            (board[0] === currentMarker && board[3] === currentMarker && board[6] === currentMarker) ||
            (board[1] === currentMarker && board[4] === currentMarker && board[7] === currentMarker) ||
            (board[2] === currentMarker && board[5] === currentMarker && board[8] === currentMarker) ||
            // Diagonal wins
            (board[0] === currentMarker && board[4] === currentMarker && board[8] === currentMarker) ||
            (board[2] === currentMarker && board[4] === currentMarker && board[6] === currentMarker)
        );
    };

    // Checks if all cells are filled (tie condition)
    const checkTie = () => board.every(cell => cell !== "");

    // Handles player move logic
    const playerRound = (index) => {
        if (gameOver || !gameboard.checkCell(index)) return;

        // Place marker and check game status
        gameboard.dropToken(index, activePlayer.marker);

        if (checkWin()) {
            gameOver = true;
            gameboard.printBoard();
            return;
        }

        if (checkTie()) {
            gameOver = true;
            gameboard.printBoard();
            return;
        }

        // Switch turns if game continues
        switchPlayerTurn();
        gameboard.printBoard();
    };

    // Switches active player
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };

    return {
        playerRound,
        resetGame,
        getActivePlayer: () => activePlayer,
        isGameOver: () => gameOver,
    };
}

/* 
 * Screen Controller
 * Handles UI updates and user interactions
 */
function ScreenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resetBtn = document.querySelector(".reset");

    // Initialize reset button
    resetBtn.textContent = "New Game";

    // Updates game board display
    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = Gameboard.getBoard();
        const activePlayer = game.getActivePlayer();

        // Update status message
        playerTurnDiv.textContent = game.isGameOver()
            ? "Game Over!"
            : `${activePlayer.name}'s turn...`;

        // Create interactive cells
        board.forEach((cell, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            cellButton.textContent = cell;

            // Disable cell if game over or already occupied
            cellButton.disabled = game.isGameOver() || !Gameboard.checkCell(index);

            boardDiv.appendChild(cellButton);
        });
    };

    // Handles cell click events
    const handleCellClick = (e) => {
        const cellIndex = e.target.dataset.index;
        if (!cellIndex || game.isGameOver()) return;

        game.playerRound(cellIndex);
        updateScreen();
    };

    // Event listeners
    boardDiv.addEventListener("click", handleCellClick);
    resetBtn.addEventListener("click", () => {
        game.resetGame();
        updateScreen();
    });

    // Initial render
    updateScreen();
}

// Initialize the game
ScreenController();