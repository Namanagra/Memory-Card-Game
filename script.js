const board = document.getElementById('gameBoard');
const moveCountEl = document.getElementById('moveCount');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const newGameBtn = document.getElementById('newGameBtn');
const difficultySelect = document.getElementById('difficulty');
const playerNameInput = document.getElementById('playerName');

let cardValues = [];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer;
let seconds = 0;
let score = 1000;
let totalCards = 16;

const baseEmojis = ['🍕', '🍔', '🍟', '🌮', '🍿', '🍩', '🥪', '🥗', '🍣', '🍰', '🍇', '🍉', '🍒', '🍎', '🍌', '🍪'];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  clearInterval(timer);
  board.innerHTML = '';
  message.classList.add('hidden');

  flippedCards = [];
  matchedCards = 0;
  moves = 0;
  seconds = 0;
  score = 1000;
  moveCountEl.textContent = '0';
  timerEl.textContent = '0s';
  scoreEl.textContent = score;

  const gridSize = parseInt(difficultySelect.value);
  totalCards = gridSize * gridSize;
  board.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

  const selectedEmojis = shuffle(baseEmojis).slice(0, totalCards / 2);
  const gameEmojis = shuffle([...selectedEmojis, ...selectedEmojis]);

  gameEmojis.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerHTML = `
      <div class="front">❓</div>
      <div class="back">${emoji}</div>
    `;
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });

  timer = setInterval(() => {
    seconds++;
    timerEl.textContent = `${seconds}s`;
    updateScore(-1);
  }, 1000);
}

function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  playSound('flipSound');
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCountEl.textContent = moves;
    checkForMatch();
  }
}

function checkForMatch() {
  const [first, second] = flippedCards;
  if (first.dataset.emoji === second.dataset.emoji) {
    playSound('matchSound');
    matchedCards += 2;
    flippedCards = [];

    if (matchedCards === totalCards) {
      playSound('winSound');
      clearInterval(timer);
      message.textContent = `🎉 Congratulations ${getPlayerName()}! 🎉`;
      message.classList.remove('hidden');
    }
  } else {
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      flippedCards = [];
    }, 800);
  }

  updateScore(-5); 
}

function updateScore(change) {
  score += change;
  if (score < 0) score = 0;
  scoreEl.textContent = score;
}

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function getPlayerName() {
  return playerNameInput.value.trim() || "Player";
}

newGameBtn.addEventListener('click', startGame);
window.addEventListener('load', startGame);
