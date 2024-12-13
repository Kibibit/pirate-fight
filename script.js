const audio = new Audio(
  "https://kibibit.io/kibibit-assets/achievibit-test/Battle on the High Seas- short.mp3"
);

audio.volume = 0.2;
// Pre-load the audio file
audio.preload = 'auto';

const clickMeBtn = document.querySelector(".click-me");
const progressBar = document.querySelector(".progress-bar"); // Assume this exists in your HTML
clickMeBtn.disabled = true; // Initially disable the button

// Listen to the 'progress' event to update the progress bar
audio.addEventListener('progress', () => {
  if (audio.buffered.length > 0) {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
    const duration = audio.duration || 1; // Fallback to 1 to prevent division by zero
    const percentage = Math.min((bufferedEnd / duration) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
  }
});

// Enable the button when the audio is fully loaded
audio.addEventListener('canplaythrough', () => {
  clickMeBtn.disabled = false; // Enable the button
  progressBar.style.width = '100%';
  progressBar.textContent = '100% Loaded';
});

// Optionally load it immediately
audio.load();

function showTextBox(text, totalTime = 0.06) {
  const textBoxText = document.getElementById("textbox");

  textBoxText.innerHTML = text;

  const split = new SplitText(textBoxText, {
    charsClass: "kb-char",
    linesClass: "kb-line"
  });

  const chars = split.chars;

  const tl = new TimelineMax({});

  return tl
    .call(() => textBoxText.classList.remove("cont-dot"))
    .call(() => textBoxText.classList.add("visible"))
    .staggerFrom(
      chars,
      0.6,
      {
        opacity: 0,
        ease: SteppedEase.config(1)
      },
      totalTime,
      "+=0"
    )
    .call(() => textBoxText.classList.add("cont-dot"), null, "+=0", 0);
}

const timeline = gsap.timeline({}).pause();

timeline
  .to(".start-screen", { display: "none" })
  .to(".scene", { opacity: 1, duration: 1 })
  .call(() => audio.play(), [], "+=2")
  .add(() =>
    showTextBox(
      `Arrr, welcome, ye scallywag! Ye dare stand before me, Captain Patchbeard, <span class="shake-little shake-constant kb-mad">THE TERROR O' THE TECH SEAS</span>!`
    )
  )
  .add(
    () =>
      showTextBox(
        `I’ve plundered APIs, sunk microservices, and left unoptimized loops to <span class="shake-little shake-constant kb-mad">ROT</span> in the darkest depths o' the ocean! And now... ye've stumbled into my codebase o' chaos.`
      ),
    "+=9"
  )
  .add(
    () =>
      showTextBox(
        `Ye think ye’ve got the wit to outsmart <span class="shake-little shake-constant kb-mad">ME</span>? This be no ordinary duel, <span class="shake-little shake-constant kb-mad">LAD</span>! We don’t swing cutlasses here; we clash in <span class="shake-little shake-constant kb-mad">LOGIC</span> and <span class="shake-little shake-constant kb-mad">RHYMES</span>!`
      ),
    "+=12"
  )
  .add(
    () =>
      showTextBox(
        "Every jab I throw be a taunt, a strike at the very heart o' yer so-called programming prowess. And every counter ye offer must be sharper than a well-tuned algorithm, or I’ll cut through yer confidence like a buffer overflow!"
      ),
    "+=12"
  )
  .add(() => showTextBox("AR! AR! ARR!...", 0.25), "+=13")
  .add(
    () =>
      showTextBox(
        "The rules be simple: I’ll spit a verse, a challenge wrapped in ridicule, and ye’ll have four answers to choose from."
      ),
    "+=4"
  )
  .add(
    () =>
      showTextBox(
        `Each answer rhymes, but only one truly fits—crafted with the <span class="kb-important">same theme as me taunt!</span> Pick wisely, and prove yer wit by matchin’ me jab with a sharper retort.`
      ),
    "+=8"
  )
  .add(
    () =>
      showTextBox(
        `Let’s see if ye’ve got what it takes to be the captain o' this coding crew... or just another <span class="shake-little shake-constant kb-mad">WASHED-UP WANNABE</span> on the shores o’ Git history!<br><br><div class="shake-little shake-constant kb-mad" style="text-align: center;">ARRR! ARRR! ARRRRRRR!<div>`,
        0.1
      ),
    "+=11"
  )
  .to(".start-game-btn-container", { opacity: 1 });

clickMeBtn.addEventListener("click", () => {
  timeline.play();
});
