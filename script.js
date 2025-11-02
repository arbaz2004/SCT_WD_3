const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const restartButton = document.getElementById("restartButton");

let circleTurn;
const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  cells.forEach(cell => {
    cell.classList.remove(X_CLASS, O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    setTimeout(() => alert(`${circleTurn ? "O" : "X"} Wins!`), 300);
  } else if (isDraw()) {
    setTimeout(() => alert("Draw!"), 300);
  } else {
    swapTurns();
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass.toUpperCase();
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function isDraw() {
  return [...cells].every(cell => cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS));
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => cells[index].classList.contains(currentClass))
  );
}
