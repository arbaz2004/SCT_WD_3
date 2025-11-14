const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreD = document.getElementById("scoreD");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let vsAI = false;
let aiDifficulty = "easy";
let history = [];

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// BUTTON HANDLING
document.getElementById("pvpBtn").onclick = () => {
    vsAI = false;
    resetGame();
    activateBtn("pvpBtn");
};
document.getElementById("aiBtn").onclick = () => {
    vsAI = true;
    resetGame();
    activateBtn("aiBtn");
};

document.querySelectorAll(".diff").forEach(btn => {
    btn.onclick = () => {
        aiDifficulty = btn.dataset.diff;
        activateGroup(".diff", btn);
    };
});

document.getElementById("startX").onclick = () => {
    currentPlayer = "X";
    resetGame();
    activateBtn("startX");
};
document.getElementById("startO").onclick = () => {
    currentPlayer = "O";
    resetGame();
    activateBtn("startO");
};

document.getElementById("resetBtn").onclick = resetGame;

document.getElementById("undoBtn").onclick = () => {
    if (history.length > 0) {
        board = history.pop();
        updateBoard();
    }
};

function activateBtn(id) {
    document.querySelectorAll(".btn").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function activateGroup(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
    activeBtn.classList.add("active");
}

// GAME LOGIC
cells.forEach((cell, index) => {
    cell.onclick = () => playerMove(index);
});

function playerMove(i) {
    if (board[i] !== "" || checkWinner()) return;

    saveHistory();
    board[i] = currentPlayer;
    updateBoard();

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (vsAI && currentPlayer === "O") setTimeout(aiMove, 300);
}

function aiMove() {
    let move = aiSelectMove();
    saveHistory();
    board[move] = "O";
    updateBoard();

    if (checkWinner()) return;
    currentPlayer = "X";
}

function aiSelectMove() {
    if (aiDifficulty === "easy") {
        let available = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);
        return available[Math.floor(Math.random()*available.length)];
    }
    // Add medium/hard later
}

function updateBoard() {
    cells.forEach((cell, i) => {
        cell.textContent = board[i];
    });
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    for (let p of winPatterns) {
        const [a,b,c] = p;
        if (board[a] && board[a]===board[b] && board[b]===board[c]) {
            highlight(p);
            declareWinner(board[a]);
            return true;
        }
    }
    if (!board.includes("")) {
        statusText.textContent = "Draw!";
        scoreD.textContent = parseInt(scoreD.textContent) + 1;
        return true;
    }
    return false;
}

function highlight(pattern) {
    pattern.forEach(i => cells[i].classList.add("win"));
}

function declareWinner(winner) {
    statusText.textContent = `Player ${winner} wins!`;
    if (winner === "X") scoreX.textContent = parseInt(scoreX.textContent) + 1;
    else scoreO.textContent = parseInt(scoreO.textContent) + 1;
}

function resetGame() {
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    history = [];
    cells.forEach(c => c.textContent = "");
    cells.forEach(c => c.classList.remove("win"));
    statusText.textContent = "Player X’s turn";
}

function saveHistory() {
    history.push([...board]);
}
