// Guard entire script inside DOMContentLoaded so elements exist
document.addEventListener("DOMContentLoaded", () => {
  console.log("TicTacToe script loaded");

  // elements
  const cells = Array.from(document.querySelectorAll(".cell"));
  const statusText = document.getElementById("statusText");
  const scoreX = document.getElementById("scoreX");
  const scoreO = document.getElementById("scoreO");
  const scoreD = document.getElementById("scoreD");

  const pvpBtn = document.getElementById("pvpBtn");
  const aiBtn = document.getElementById("aiBtn");
  const resetBtn = document.getElementById("resetBtn");
  const diffButtons = Array.from(document.querySelectorAll(".diff-btn"));
  const startButtons = Array.from(document.querySelectorAll(".start-btn"));

  // state
  let board = Array(9).fill("");
  let currentPlayer = "X";
  let vsAI = false;
  let aiDifficulty = "easy";
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // safety checks
  if (!cells.length) {
    console.error("No board cells found - check your HTML");
    statusText.textContent = "Error: board not found";
    return;
  }

  // helpers
  function setStatus(txt){ statusText.textContent = txt; }
  function clearBoardUI(){
    cells.forEach(c => { c.textContent = ""; c.classList.remove("win"); });
  }
  function updateBoardUI(){
    cells.forEach((c,i) => c.textContent = board[i]);
  }
  function resetGame() {
    board = Array(9).fill("");
    clearBoardUI();
    setStatus(`Player ${currentPlayer}'s turn`);
  }

  // handlers for control buttons
  pvpBtn.addEventListener("click", () => {
    vsAI = false;
    setActiveGroup(".mode-btn", pvpBtn);
    console.log("Mode: PvP");
    resetGame();
  });

  aiBtn.addEventListener("click", () => {
    vsAI = true;
    setActiveGroup(".mode-btn", aiBtn);
    console.log("Mode: AI");
    resetGame();
  });

  diffButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      aiDifficulty = btn.dataset.diff || "easy";
      setActiveGroup(".diff-btn", btn);
      console.log("AI diff:", aiDifficulty);
    });
  });

  startButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentPlayer = btn.dataset.start || "X";
      setActiveGroup(".start-btn", btn);
      console.log("Starting player:", currentPlayer);
      resetGame();
    });
  });

  resetBtn.addEventListener("click", () => {
    // reset scores and state
    scoreX.textContent = "0";
    scoreO.textContent = "0";
    scoreD.textContent = "0";
    currentPlayer = "X";
    setActiveGroup(".start-btn", document.querySelector('[data-start="X"]'));
    resetGame();
    console.log("Reset all");
  });

  // board cell events - click and keyboard Enter/Space
  cells.forEach((cell, i) => {
    cell.addEventListener("click", () => handleMove(i));
    cell.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") handleMove(i);
    });
  });

  function setActiveGroup(selector, activeBtn){
    document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
    if(activeBtn) activeBtn.classList.add("active");
  }

  function handleMove(i){
    if (board[i] || checkWinner()) return;
    board[i] = currentPlayer;
    updateBoardUI();

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    setStatus(`Player ${currentPlayer}'s turn`);

    if (vsAI && currentPlayer === "O") {
      // simple delay so UI updates feel natural
      setTimeout(aiMove, 280);
    }
  }

  function aiMove(){
    const available = board.map((v,idx) => v === "" ? idx : null).filter(v => v !== null);
    if (!available.length) return;
    // easy = random; medium/hard use smarter move (basic priority)
    let move;
    if (aiDifficulty === "easy") {
      move = available[Math.floor(Math.random()*available.length)];
    } else {
      // simple priority: win -> block -> center -> corner -> side
      move = bestMoveSimple(available);
    }
    board[move] = "O";
    updateBoardUI();
    if (!checkWinner()) {
      currentPlayer = "X";
      setStatus(`Player ${currentPlayer}'s turn`);
    }
  }

  function bestMoveSimple(available){
    // try win
    for (let idx of available){
      const copy = board.slice(); copy[idx] = "O";
      if (isWinner(copy, "O")) return idx;
    }
    // try block X
    for (let idx of available){
      const copy = board.slice(); copy[idx] = "X";
      if (isWinner(copy, "X")) return idx;
    }
    // center
    if (available.includes(4)) return 4;
    // corners
    const corners = [0,2,6,8].filter(i=>available.includes(i));
    if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
    // else random side
    return available[Math.floor(Math.random()*available.length)];
  }

  function isWinner(bd, player){
    return winPatterns.some(([a,b,c]) => bd[a] === player && bd[b] === player && bd[c] === player);
  }

  function checkWinner(){
    for (let [a,b,c] of winPatterns){
      if (board[a] && board[a] === board[b] && board[b] === board[c]){
        // highlight and update score
        [a,b,c].forEach(i => cells[i].classList.add("win"));
        declareWinner(board[a]);
        return true;
      }
    }
    if (!board.includes("")){
      setStatus("Draw!");
      scoreD.textContent = String(Number(scoreD.textContent) + 1);
      return true;
    }
    return false;
  }

  function declareWinner(winner){
    setStatus(`${winner} Wins!`);
    if (winner === "X") scoreX.textContent = String(Number(scoreX.textContent) + 1);
    else scoreO.textContent = String(Number(scoreO.textContent) + 1);
  }

  // initial state
  resetGame();
});
