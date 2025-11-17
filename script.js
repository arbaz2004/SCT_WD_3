document.addEventListener("DOMContentLoaded", () => {

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
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    /* ------- BUTTON HANDLERS ------- */

    document.querySelectorAll(".diff").forEach(btn => {
        btn.addEventListener("click", () => {
            aiDifficulty = btn.dataset.diff;
            setActive(".diff", btn);
        });
    });

    document.getElementById("pvpBtn").addEventListener("click", () => {
        vsAI = false;
        setActive(".mode-btn", document.getElementById("pvpBtn"));
        resetBoard();
    });

    document.getElementById("aiBtn").addEventListener("click", () => {
        vsAI = true;
        setActive(".mode-btn", document.getElementById("aiBtn"));
        resetBoard();
    });

    document.querySelectorAll(".start").forEach(btn => {
        btn.addEventListener("click", () => {
            currentPlayer = btn.dataset.start;
            setActive(".start", btn);
            resetBoard();
        });
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
        scoreX.textContent = "0";
        scoreO.textContent = "0";
        scoreD.textContent = "0";
        resetBoard();
    });

    document.getElementById("newGameBtn").addEventListener("click", resetBoard);

    /* ------- GAME LOGIC ------- */

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleMove(index));
    });

    function handleMove(i) {
        if (board[i] !== "" || checkWinner()) return;

        board[i] = currentPlayer;
        updateBoard();

        if (checkWinner()) return;

        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (vsAI && currentPlayer === "O") {
            setTimeout(aiMove, 300);
        } else {
            statusText.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function aiMove() {
        let available = board.map((v,i) => v === "" ? i : null).filter(v => v !== null);
        let move = available[Math.floor(Math.random() * available.length)];
        board[move] = "O";
        updateBoard();
        if (!checkWinner()) {
            currentPlayer = "X";
            statusText.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function updateBoard() {
        cells.forEach((cell, i) => cell.textContent = board[i]);
    }

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
            scoreD.textContent = +scoreD.textContent + 1;
            return true;
        }

        return false;
    }

    function highlight(pattern) {
        pattern.forEach(i => cells[i].classList.add("win"));
    }

    function declareWinner(winner) {
        statusText.textContent = `${winner} Wins!`;
        if (winner === "X") scoreX.textContent = +scoreX.textContent + 1;
        else scoreO.textContent = +scoreO.textContent + 1;
    }

    function resetBoard() {
        board = ["","","","","","","","",""];
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("win");
        });
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }

    function setActive(selector, btn) {
        document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }

    /* INITIAL */
    resetBoard();
});
