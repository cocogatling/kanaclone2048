var board;
var score = 0;
var rows = 4;
var columns = 4;
var moveCount = 0;

window.onload = function() {
    setGame();
}

function setGame() {
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        tile.classList.add("x"+num.toString());              
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false;

    if (e.code == "ArrowLeft" || e.code === "KeyA") {
        moved = slideLeft();
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowRight" || e.code === "KeyD") {
        moved = slideRight();
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowUp" || e.code === "KeyW") {
        moved = slideUp();
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowDown" || e.code === "KeyS") {
        moved = slideDown();
        setTwo();
        checkGameOver();
    }

    if (moved) {
        setTwo();
        moveCount++;
        document.getElementById("score").innerText = score;
        document.getElementById("moves").innerText = moveCount;
        checkGameOver();
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
    e.preventDefault(); // prevent scrolling during swipe
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
        // Horizontal swipe
        if (dx > 30) {
            moved = slideRight();
            checkGameOver();
        } else if (dx < -30) {
            moved = slideLeft();
            checkGameOver();
        }
    } else {
        // Vertical swipe
        if (dy > 30) {
            moved = slideDown();
            checkGameOver();
        } else if (dy < -30) {
            moved = slideUp();
            checkGameOver();
        }
    }

    if (moved) {
        setTwo();
        moveCount++;
        document.getElementById("score").innerText = score;
        document.getElementById("moves").innerText = moveCount;
        checkGameOver(); 
    }
}

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    let oldBoard = JSON.stringify(board);

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    let newBoard = JSON.stringify(board);
    return oldBoard !== newBoard;
}

function slideRight() {
    let oldBoard = JSON.stringify(board);

    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    let newBoard = JSON.stringify(board);
    return oldBoard !== newBoard;
}

function slideUp() {
    let oldBoard = JSON.stringify(board);

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
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
    let oldBoard = JSON.stringify(board);

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
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
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
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
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

function canMove() {
    if (hasEmptyTile()) return true; // still room to move

    // check for adjacent merges
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
        console.log("Game over triggered.");
        showGameOver();
    }
}

function showGameOver() {
    document.getElementById("title").innerText = "Game Over";
    document.getElementById("scoreText").innerText = `Final Score: ${score} in ${moveCount} moves`;
}

function restartGame() {
    location.reload(); // or call your own resetGame() function if you have one
}

// Add an event listener for the reset button
document.getElementById("resetButton").addEventListener("click", restartGame);