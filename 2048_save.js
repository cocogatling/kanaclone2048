var board;
var score = 0;
var rows = 4;
var columns = 4;
var moveCount = 0;
var oldBoard = null;

// Save the current game state
function saveGame() {
    const saveData = {
        board: board,
        score: score,
        moveCount: moveCount
    };
    localStorage.setItem("2048Save", JSON.stringify(saveData));
    console.log("Game saved!");
}

// Load saved game state
function loadGame() {
    const saveData = JSON.parse(localStorage.getItem("2048Save"));
    if (saveData) {
        board = saveData.board;
        score = saveData.score;
        moveCount = saveData.moveCount;
        initBoard();
        setBoard();
        document.getElementById("score").innerText = score;
        document.getElementById("moves").innerText = moveCount;
        console.log("Game loaded!");
    } else {
        setGame();
        console.log("New game started!");
    }
}

// Initialize the grid divs
function initBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            document.getElementById("board").append(tile);
        }
    }
}

// Update the grid visuals with current board data
function setBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

window.onload = function() {
    loadGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    initBoard();
    setTwo();
    setTwo();
    document.getElementById("score").innerText = score;
    document.getElementById("moves").innerText = moveCount;
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        tile.classList.add("x" + num.toString());
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false;

    if (e.code == "ArrowLeft" || e.code === "KeyA") {
        moved = slideLeft();
    } else if (e.code == "ArrowRight" || e.code === "KeyD") {
        moved = slideRight();
    } else if (e.code == "ArrowUp" || e.code === "KeyW") {
        moved = slideUp();
    } else if (e.code == "ArrowDown" || e.code === "KeyS") {
        moved = slideDown();
    }

    if (moved) {
        setTwo();
        moveCount++;
        document.getElementById("score").innerText = score;
        document.getElementById("moves").innerText = moveCount;
        checkGameOver();
        saveGame();
    }
});

// Touch support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
}, false);

function handleSwipeGesture() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    let moved = false;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
            moved = slideRight();
        } else if (dx < -30) {
            moved = slideLeft();
        }
    } else {
        if (dy > 30) {
            moved = slideDown();
        } else if (dy < -30) {
            moved = slideUp();
        }
    }

    if (moved) {
        setTwo();
        moveCount++;
        document.getElementById("score").innerText = score;
        document.getElementById("moves").innerText = moveCount;
        checkGameOver();
        saveGame();
    }
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    oldBoard = board.map(row => row.slice());

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    let newBoard = JSON.stringify(board);
    return oldBoard !== newBoard;
}

function slideRight() {
    oldBoard = board.map(row => row.slice());

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    let newBoard = JSON.stringify(board);
    return oldBoard !== newBoard;
}

function slideUp() {
    oldBoard = board.map(row => row.slice());

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    let newBoard = JSON.stringify(board);
    return oldBoard !== newBoard;
}

function slideDown() {
    oldBoard = board.map(row => row.slice());

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    let newBoard = JSON.stringify(board);
    return oldBoard !== newBoard;
}

function setTwo() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function undoMove() {
    if (oldBoard) {
        board = oldBoard.map(row => row.slice());
        setBoard();
    }
}

function canMove() {
    if (hasEmptyTile()) return true;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return true;
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return true;
        }
    }

    return false;
}

function checkGameOver() {
    if (!canMove()) {
        showGameOver();
    }
}

function showGameOver() {
    document.getElementById("title").innerText = "Game Over";
    document.getElementById("scoreText").innerText = `Final Score: ${score} in ${moveCount} moves`;
}

function restartGame() {
    localStorage.removeItem("2048Save");
    location.reload();
}

document.getElementById("resetButton").addEventListener("click", restartGame);