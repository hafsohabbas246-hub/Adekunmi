const openStory = document.getElementById("openStory");
const story = document.getElementById("story");
const wishButton = document.getElementById("wishButton");
const hiddenWish = document.getElementById("hiddenWish");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const musicIcon = document.getElementById("musicIcon");
let audioContext = null;
let musicTimer = null;
let musicOn = false;

openStory.addEventListener("click", () => {
  story.scrollIntoView({ behavior: "smooth" });
  sparkleBurst(24);
});

wishButton.addEventListener("click", () => {
  hiddenWish.hidden = !hiddenWish.hidden;
  wishButton.textContent = hiddenWish.hidden ? "Tap for one last little wish ✨" : "A wish just for you ♡";
  if (!hiddenWish.hidden) sparkleBurst(30);
});

function sparkleBurst(count = 18) {
  const layer = document.querySelector(".sparkle-layer");
  const symbols = ["✦", "✧", "♡", "✿", "⋆"];
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "sparkle";
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.left = `${5 + Math.random() * 90}%`;
    star.style.top = `${35 + Math.random() * 55}%`;
    star.style.fontSize = `${12 + Math.random() * 18}px`;
    star.style.animationDelay = `${Math.random() * .55}s`;
    layer.appendChild(star);
    window.setTimeout(() => star.remove(), 2300);
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* A small original chime loop uses the browser's built-in audio synthesis.
   It only plays after the visitor presses the music button. */
function playNote(frequency, start, duration, volume = 0.035) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}
function playPhrase() {
  if (!audioContext || !musicOn) return;
  const now = audioContext.currentTime;
  [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46].forEach((note, i) => {
    playNote(note, now + i * 0.33, 0.28, 0.018);
  });
}
musicToggle.addEventListener("click", async () => {
  if (!musicOn) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      musicLabel.textContent = "Music unavailable";
      return;
    }
    audioContext = audioContext || new AudioCtx();
    if (audioContext.state === "suspended") await audioContext.resume();
    musicOn = true;
    musicToggle.setAttribute("aria-pressed", "true");
    musicLabel.textContent = "Pause music";
    musicIcon.textContent = "Ⅱ";
    playPhrase();
    musicTimer = window.setInterval(playPhrase, 2800);
  } else {
    musicOn = false;
    window.clearInterval(musicTimer);
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "A little music";
    musicIcon.textContent = "♫";
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("button") && !event.target.closest("#musicToggle")) {
    // Small visual flourish on intentional button taps.
    if (event.target.closest("#wishButton")) return;
  }
});
