const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const toggleModeBtn = document.getElementById("toggleMode");
const clearDataBtn = document.getElementById("clearData");
const recentList = document.getElementById("recentList");

let board = Array(9).fill(null);
let isXNext = true;
let vsComputer = false;
let winner = null;

let profile = JSON.parse(localStorage.getItem("profile")) || { name: "Player 1", avatar: "", totalGames: 0 };
let scores = JSON.parse(localStorage.getItem("scores")) || { X: 0, O: 0, Draws: 0 };
let recent = JSON.parse(localStorage.getItem("recent")) || [];

const playerNameEl = document.getElementById("playerName");
const totalGamesEl = document.getElementById("totalGames");
const avatarEl = document.getElementById("avatar");
const avatarUpload = document.getElementById("avatarUpload");
const editProfileBtn = document.getElementById("editProfile");
const editSection = document.getElementById("editSection");
const nameInput = document.getElementById("nameInput");
const saveProfileBtn = document.getElementById("saveProfile");
const cancelEditBtn = document.getElementById("cancelEdit");

function init() {
  renderBoard();
  updateUI();
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell || "";
    div.addEventListener("click", () => handleClick(i));
    boardEl.appendChild(div);
  });
}

function handleClick(i) {
  if (board[i] || winner) return;
  board[i] = isXNext ? "X" : "O";
  isXNext = !isXNext;
  winner = checkWinner();
  if (winner) updateScores(winner);
  renderBoard();
  updateUI();

  if (vsComputer && !isXNext && !winner) {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  const empty = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
  const move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = "O";
  isXNext = true;
  winner = checkWinner();
  if (winner) updateScores(winner);
  renderBoard();
  updateUI();
}

function checkWinner() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (!board.includes(null)) return "Draw";
  return null;
}

function updateScores(result) {
  if (result === "Draw") scores.Draws++;
  else scores[result]++;
  profile.totalGames++;
  recent.unshift({ winner: result, time: new Date().toLocaleTimeString() });
  recent = recent.slice(0, 5);
  saveData();
}

function updateUI() {
  document.getElementById("xWins").textContent = scores.X;
  document.getElementById("oWins").textContent = scores.O;
  document.getElementById("draws").textContent = scores.Draws;
  playerNameEl.textContent = profile.name;
  totalGamesEl.textContent = profile.totalGames;
  avatarEl.src = profile.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  statusEl.classList.remove("winner-announce", "draw-announce");

  if (winner) {
    if (winner === "Draw") {
      statusEl.textContent = "🤝 It's a Draw!";
      statusEl.classList.add("draw-announce");
    } else {
      statusEl.textContent = `🏆 Winner: ${winner}`;
      statusEl.classList.add("winner-announce");
    }
  } else {
    statusEl.textContent = `Turn: ${isXNext ? "X" : "O"}`;
  }

  recentList.innerHTML = recent
    .map((r) => `<li><span>${r.winner === "Draw" ? "🤝 Draw" : `🏆 ${r.winner} Won`}</span><span>${r.time}</span></li>`)
    .join("");
}


function restartGame() {
  board = Array(9).fill(null);
  isXNext = true;
  winner = null;
  renderBoard();
  updateUI();
}

function toggleMode() {
  vsComputer = !vsComputer;
  toggleModeBtn.textContent = vsComputer ? "👥 2 Player Mode" : "💻 vs Computer";
}

function clearData() {
  localStorage.clear();
  scores = { X: 0, O: 0, Draws: 0 };
  profile = { name: "Player 1", avatar: "", totalGames: 0 };
  recent = [];
  restartGame();
  updateUI();
}

function saveData() {
  localStorage.setItem("scores", JSON.stringify(scores));
  localStorage.setItem("profile", JSON.stringify(profile));
  localStorage.setItem("recent", JSON.stringify(recent));
}

// Profile editing
editProfileBtn.onclick = () => (editSection.classList.toggle("hidden"));
saveProfileBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (name) profile.name = name;
  profile.avatar = avatarEl.src;
  saveData();
  editSection.classList.add("hidden");
  updateUI();
};
cancelEditBtn.onclick = () => editSection.classList.add("hidden");

avatarUpload.onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarEl.src = ev.target.result;
      profile.avatar = ev.target.result;
      saveData();
    };
    reader.readAsDataURL(file);
  }
};

restartBtn.onclick = restartGame;
toggleModeBtn.onclick = toggleMode;
clearDataBtn.onclick = clearData;

init();
