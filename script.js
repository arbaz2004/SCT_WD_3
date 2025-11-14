const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreD = document.getElementById("scoreD");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let vsAI = false;
let aiDifficulty = "easy";

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// BUTTONS
document.getElementById("pvpBtn").onclick = () => {
    vsAI = false;
    activate("pvpBtn");
    resetGame();
};

document.getElementById("aiBtn").onclick = () => {
    vsAI = true;
    activate("aiBtn");
    resetGame();
};

document.querySelectorAll(".diff").forEach(btn => {
    btn.onclick = () => {
        aiDifficulty = btn.dataset.diff;
        activateGroup(".diff", btn);
    };
});

document.getElementById("startX").onclick = () => {
    currentPlayer = "X";
    activate("startX");
    resetGame();
};
document.getElementById("startO").onclick = () => {
    currentPlayer = "O";
    activate("startO");
    resetGame();
};

document.getElementById("resetBtn").onclick = resetGame;

// ACTIVATE HELPERS
function activate(id) {
    document.querySelectorAll(".btn").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function activateGroup(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
    activeBtn.classList.add("active");
}

// CELL CLICK HANDLER
cells.forEach((cell, i) => {
    cell.onclick = () => handleMove(i);
});

function handleMove(i) {
    if (board[i] !== "" || checkWinner()) return;

    board[i] = currentPlayer;
    updateBoard();

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (vsAI && currentPlayer === "O")
        setTimeout(aiMove, 350);
}

function aiMove() {
    let available = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);

    let move = available[Math.floor(Math.random()*available.length)];

    board[move] = "O";
    updateBoard();

    if (!checkWinner()) currentPlayer = "X";
}

// UPDATE UI
function updateBoard() {
    cells.forEach((c, i) => c.textContent = board[i]);
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// CHECK WINNER
function checkWinner() {
    for (let p of winPatterns) {
        const [a,b,c] = p;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
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
    statusText.textContent = `${winner} Wins!`;
    if (winner === "X") scoreX.textContent = parseInt(scoreX.textContent) + 1;
    else scoreO.textContent = parseInt(scoreO.textContent) + 1;
}

// RESET GAME
function resetGame() {
    board = ["","","","","","","","",""];
    cells.forEach(c => {
        c.textContent = "";
        c.classList.remove("win");
    });
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}
