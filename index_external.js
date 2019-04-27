/*
 * Student: Ibrahim Jomaa | 300911528
 * Date: 3/29/2019
 * Filename: index_external.js
 */

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 860;
canvas.height = 500;
var gameArea = document.getElementById("gameArea");
gameArea.appendChild(canvas);

var bgImage = new Image(canvas.width, canvas.height);
bgImage.src = "images/background.png";

const NUM_BADNIKS = 8;
var badniks = new Array();
for (var i = 0; i < NUM_BADNIKS; i++) {
  badniks[i] = new Image();
  badniks[i].src = "images/badnik_" + i + ".png";
}

var badnikImage = badniks[0];
var badnik = {
  x: 0,
  y: 0
};

var badnikHitbox;
var score = 0;

function displayScore() {
  score++;
  var scoreMessage = "SCORE: " + score;
  document.querySelector("footer p").textContent = scoreMessage;
}

function resetScore() {
  score = 0;
  var scoreMessage = "SCORE: " + score;
  document.querySelector("footer p").textContent = scoreMessage;
}

function randomizeBadnik() {
  var badnikId = Math.round(Math.random() * (NUM_BADNIKS - 1));
  badnikImage = badniks[badnikId];
}

function teleportBadnik() {
  const X_PADDING = 125;
  const Y_PADDING = 125;
  badnik.x = (X_PADDING / 4) + (Math.random() * (canvas.width - X_PADDING));
  badnik.y = (Y_PADDING / 4) + (Math.random() * (canvas.height - Y_PADDING));
  randomizeBadnik();
}

// Teleport badnik across screen consistently.
const DEFAULT_INTERVAL = 3000;
var interval = DEFAULT_INTERVAL;
var autoTeleport = window.setInterval(teleportBadnik, interval);

function increaseSpeed() {
  window.clearInterval(autoTeleport);
  interval *= 0.90;
  autoTeleport = window.setInterval(teleportBadnik, interval);
}

function resetSpeed() {
  window.clearInterval(autoTeleport);
  interval = DEFAULT_INTERVAL;
  autoTeleport = window.setInterval(teleportBadnik, interval);
}

function displayBattleBanter() {
  var banterMessages = [
    "What are you doing?!?",
    "I wonder how my robots are doing?",
    "Now, let me show you the power of my latest, greatest creation!",
    "You know what they say, the more, the merrier!",
    "Oh, you've asked for it! No more Mr. Nice Guy! Time to crush you once and for all!",
    "All right, you asked for it.",
    "Very well. If you refuse to obey me, then you'll just have to deal with my finest creation yet!",
    "Get ready for a real blast. It's time for Missile Fever.",
    "Now it's time for Bomb Fever. Get ready to be blasted into oblivion.",
    "Pawn Fever! Prepare to be skewered!"
  ]
  var banterMessage = "Eggman: " + banterMessages[Math.round(Math.random() * (banterMessages.length - 1))];
  document.getElementById("banterArea").textContent = banterMessage;
}

// Display battle banter message consistently.
var autoBanter = window.setInterval(displayBattleBanter, DEFAULT_INTERVAL);

function hitDetection(event) {
  // Convert point coordinates relative to the canvas area.
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;

  // Check if point is within badnik hitbox.
  var isHit = (
    ((badnik.x <= x) && (x <= (badnik.x + badnikHitbox.width))) &&
    ((badnik.y <= y) && (y <= (badnik.y + badnikHitbox.height)))
  );

  if (isHit) {
    increaseSpeed();
    displayScore();
    teleportBadnik();
  }
}

function addEventListeners() {
  canvas.addEventListener("click", hitDetection, false);

  var buttons = document.querySelectorAll("button");
  var resetSpeedButton = buttons[0];
  resetSpeedButton.addEventListener("click", resetSpeed, false);
  var resetScoreButton = buttons[1];
  resetScoreButton.addEventListener("click", resetScore, false);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(badnikImage, badnik.x, badnik.y);
  badnikHitbox = ctx.getImageData(badnikImage.width, badnikImage.height, badnik.x, badnik.y);
}

function main() {
  render();
  window.requestAnimationFrame(main);
}

function loadGame() {
  addEventListeners();
  teleportBadnik();
  displayBattleBanter();
  main();
}

window.addEventListener("load", loadGame, false);

