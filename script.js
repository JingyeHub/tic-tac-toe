const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", "",];

    const getBoard = () => board;

    const dropToken = (index, token) => {
        board[index] = token;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    const checkCell = (index) => {
        return board[index] === "" ? true : false;
    }

    const printBoard = () => {
        console.log(`
            ${board[0]} ${board[1]} ${board[2]}
            ${board[3]} ${board[4]} ${board[5]}
            ${board[6]} ${board[7]} ${board[8]}
            `)
    }

    return {
        getBoard,
        dropToken,
        resetBoard,
        checkCell,
        printBoard,
    }
})();

function Player(name, marker) {
    return {
        name,
        marker
    }
}

function gameControler() {
    const gameboard = Gameboard;
    const board = gameboard.getBoard();
    const playerOne = Player("P1", "X");
    const playerTwo = Player("P2", "O");

    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const checkWin = () => {
        const currentMarker = activePlayer.marker;
        return (
            // Rows
            (board[0] === currentMarker && board[1] === currentMarker && board[2] === currentMarker) ||
            (board[3] === currentMarker && board[4] === currentMarker && board[5] === currentMarker) ||
            (board[6] === currentMarker && board[7] === currentMarker && board[8] === currentMarker) ||
            // Columns
            (board[0] === currentMarker && board[3] === currentMarker && board[6] === currentMarker) ||
            (board[1] === currentMarker && board[4] === currentMarker && board[7] === currentMarker) ||
            (board[2] === currentMarker && board[5] === currentMarker && board[8] === currentMarker) ||
            // Diagonal
            (board[0] === currentMarker && board[4] === currentMarker && board[8] === currentMarker) ||
            (board[2] === currentMarker && board[4] === currentMarker && board[6] === currentMarker)
        )
    };

    const checkTie = () => {
        return board.every(cell => cell != "");
    }

    const playerRound = (index) => {
        if (!gameboard.checkCell(index)) return;

        gameboard.dropToken(index, activePlayer.marker);

        if (checkWin()) {
            gameboard.printBoard();
            console.log(`${activePlayer.name} won!`);
            gameboard.resetBoard();
            activePlayer = playerOne;
            return;
        }

        if (checkTie()) {
            gameboard.printBoard();
            console.log(`Game over, it's a tie.`);
            gameboard.resetBoard();
            activePlayer = playerOne;
            return;
        }

        gameboard.printBoard();
        switchPlayerTurn();
    }

    return {
        playerRound,
    }
}

const game = gameControler();