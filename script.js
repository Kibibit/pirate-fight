let gameStarted = false; // Flag to track if the game has started
let selectedChoiceDirection = null; // Tracks the currently selected choice
let currentTaunt = null;
const getRandomTaunt = getTauntsShuffler();
const questionTimer = 15; // Time in seconds to answer each question
let currentTimerAnimation = null; // Tracks the current timer animation timeline
let interactionAllowed = true; // Flag to track if user interaction is allowed

let isAnimating = false; // Tracks if character animation is running
let currentLabelIndex = 0; // Tracks the current label index in the timeline
let currentTextTimeline = null; // Tracks the current text animation timeline

const audio = new Audio(
  "https://kibibit.io/kibibit-assets/achievibit-test/Battle on the High Seas- short.mp3"
);

const audioSecondOption = new Audio(
  "https://kibibit.io/kibibit-assets/achievibit-test/parrot-on-my-shoulder.mp3"
);
audioSecondOption.volume = 0.2;
audioSecondOption.loop = true;

const startGameBtn = document.querySelector(".start-game-btn");

audio.volume = 0.2;

function showTextBox(text, totalTime = 0.06) {
  const textBoxText = document.getElementById("textbox");

  textBoxText.innerHTML = text;

  const split = new SplitText(textBoxText, {
    charsClass: "kb-char",
    linesClass: "kb-line"
  });

  const chars = split.chars;

  isAnimating = true; // Mark that animation is starting

  // Create and store the text animation timeline
  currentTextTimeline = new TimelineMax({})
    .call(() => {
      const existingDivTimer = document.querySelector(".timer");

      if (existingDivTimer) {
        return;
      }

      const timerDiv = document.createElement("div");
      timerDiv.className = "timer";
      textBoxText.appendChild(timerDiv);
    })
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
    .call(
      () => {
        textBoxText.classList.add("cont-dot");
        isAnimating = false; // Mark animation as completed
        currentTextTimeline = null; // Clear the reference
      },
      null,
      "+=0",
      0
    );

  return currentTextTimeline;
}

const timeline = gsap.timeline({}).pause();

timeline
  .to(".start-screen", { display: "none" })
  .to(".scene", { opacity: 1, duration: 1 })
  .call(() => audio.play(), [], "+=2")
  .addLabel("block1")
  .add(() =>
    showTextBox(
      `Arrr, welcome, ye scallywag! Ye dare stand before me, Captain Patchbeard, <span class="shake-little shake-constant kb-mad">THE TERROR O' THE TECH SEAS</span>!`
    )
  )
  .addLabel("block2")
  .add(
    () =>
      showTextBox(
        `I’ve plundered APIs, sunk microservices, and left unoptimized loops to <span class="shake-little shake-constant kb-mad">ROT</span> in the darkest depths o' the ocean! And now... ye've stumbled into my codebase o' chaos.`
      ),
    "+=9"
  )
  .addLabel("block3")
  .add(
    () =>
      showTextBox(
        `Ye think ye’ve got the wit to outsmart <span class="shake-little shake-constant kb-mad">ME</span>? This be no ordinary duel, <span class="shake-little shake-constant kb-mad">LAD</span>! We don’t swing cutlasses here; we clash in <span class="shake-little shake-constant kb-mad">LOGIC</span> and <span class="shake-little shake-constant kb-mad">RHYMES</span>!`
      ),
    "+=12"
  )
  .addLabel("block4")
  .add(
    () =>
      showTextBox(
        "Every jab I throw be a taunt, a strike at the very heart o' yer so-called programming prowess. And every counter ye offer must be sharper than a well-tuned algorithm, or I’ll cut through yer confidence like a buffer overflow!"
      ),
    "+=12"
  )
  .addLabel("block5")
  .add(() => showTextBox("AR! AR! ARR!...", 0.3), "+=13")
  .addLabel("block6")
  .add(
    () =>
      showTextBox(
        "The rules be simple: I’ll spit a verse, a challenge wrapped in ridicule, and ye’ll have four answers to choose from."
      ),
    "+=4"
  )
  .addLabel("block7")
  .add(
    () =>
      showTextBox(
        `Each answer rhymes, but only one truly fits—crafted with the <span class="kb-important">same theme as me taunt!</span> Pick wisely, and prove yer wit by matchin’ me jab with a sharper retort.`
      ),
    "+=8"
  )
  .addLabel("block9")
  .add(
    () =>
      showTextBox(
        `Let’s see if ye’ve got what it takes to be the captain o' this coding crew... or just another <span class="shake-little shake-constant kb-mad">WASHED-UP WANNABE</span> on the shores o’ Git history!<br><br><div class="shake-little shake-constant kb-mad" style="text-align: center;">ARRR! ARRR! ARRRRRRR!<div>`,
        0.1
      ),
    "+=11"
  )
  .addLabel("block10")
  .to(".start-game-btn-container", { opacity: 1, display: "flex" });

const clickMeBtn = document.querySelector(".click-me");

clickMeBtn.addEventListener("click", () => {
  timeline.play();
});

startGameBtn.addEventListener("click", () => {
  gameStarted = true; // Mark the game as started
  timeline.pause();
  audio.pause();

  const fightTimeline = gsap.timeline({}).pause();
  const choicesContainer = document.querySelector(".choices-container");

  fightTimeline
    .to(".start-game-btn-container", { opacity: 0, display: "none" })
    .call(() => audioSecondOption.play(), [], "+=0")
    .to("#textbox", { marginBottom: "120px" })
    .to(".choices-container", { opacity: 1, display: "flex" })
    .call(() => (currentTaunt = getRandomTaunt()))
    .add(() => showTextBox(currentTaunt.text))
    .add(() => changeOptions(currentTaunt.options), "+=1")
    // add class timer and set data-timer-total and update data-timer-current. should be 6 seconds
    .add(() => showTimer(questionTimer), "+=1")
    .play();
});

function showTimer(secondsTotal = questionTimer) {
  const timerTimeline = gsap.timeline({});
  currentTimerAnimation = timerTimeline;

  timerTimeline
    .to(".timer", 0.3, { width: "100%" })
    // count down the timer
    .to(".timer", secondsTotal, { width: "0%" }, "+=1");

  return timerTimeline;
}

function hideChoices() {
  const hideChoicesTimeline = gsap.timeline({}).pause();

  hideChoicesTimeline.to(".choice", { opacity: 0 });

  return hideChoicesTimeline.play();
}

function changeOptions(newOptions) {
  const choicesTimeline = gsap.timeline({}).pause();
  const choicesContainer = document.querySelector(".choices-container");

  choicesTimeline
    .to(".choice", { opacity: 0 })
    .call(() => {
      choicesContainer.querySelector(".choice.top").innerText = newOptions[0];
      choicesContainer.querySelector(".choice.left").innerText = newOptions[1];
      choicesContainer.querySelector(".choice.right").innerText = newOptions[2];
      choicesContainer.querySelector(".choice.bottom").innerText =
        newOptions[3];
      // highlightChoice(0); // Highlight the first choice by default
    })
    .to(".choice", { opacity: 1 });

  return choicesTimeline.play();
}

function highlightChoice(direction) {
  const highlightTimeline = gsap.timeline({}).pause();
  const choicesContainer = document.querySelector(".choices-container");
  const selectedChoice = choicesContainer.querySelector(`.choice.${direction}`);
  const allChoices = choicesContainer.querySelector(".choice");

  highlightTimeline
    .call(() => (interactionAllowed = false))
    .call(() => currentTimerAnimation.kill())
    .call(() => {
      choicesContainer.classList.add("decision-made");
      selectedChoice.classList.add("highlighted");

      if (selectedChoice.innerText === currentTaunt.correctResponse) {
        choicesContainer.classList.add("success");
      } else {
        choicesContainer.classList.add("failure");
      }
    })
    .add(() => hideChoices(), "+=3")
    .call(() => {
      choicesContainer.classList.remove("decision-made");
      choicesContainer.classList.remove("success");
      choicesContainer.classList.remove("failure");
      selectedChoice.classList.remove("highlighted");
    })
    .call(() => (currentTaunt = getRandomTaunt()))
    .add(() => showTextBox(currentTaunt.text))
    .add(() => changeOptions(currentTaunt.options), "+=1")
    .call(() => (interactionAllowed = true))
    .add(() => showTimer(questionTimer), "+=1");

  return highlightTimeline.play();
}

document.querySelectorAll(".choice").forEach((choice) => {
  choice.addEventListener("click", () => {
    if (gameStarted && interactionAllowed) {
      const direction = choice.classList.contains("top")
        ? "top"
        : choice.classList.contains("bottom")
        ? "bottom"
        : choice.classList.contains("left")
        ? "left"
        : "right";
      highlightChoice(direction);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (gameStarted && interactionAllowed) {
    if (event.code === "ArrowUp") {
      highlightChoice("top");
    } else if (event.code === "ArrowDown") {
      highlightChoice("bottom");
    } else if (event.code === "ArrowLeft") {
      highlightChoice("left");
    } else if (event.code === "ArrowRight") {
      highlightChoice("right");
    }
  } else if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    handleSkipText();
  }
});

// Handle skipping text with clicks before the game starts
document.body.addEventListener("click", (event) => {
  // Check if the game hasn't started and the click is not on a button
  if (!gameStarted && !event.target.closest("button")) {
    handleSkipText();
  }
});

function getTauntsShuffler() {
  const taunts = getTaunts(); // Get the full list of taunts
  let shuffledTaunts = shuffleArrayWithAnswers(taunts);
  let currentIndex = 0;

  function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  function shuffleArrayWithAnswers(tauntsArray) {
    return tauntsArray
      .map((taunt) => ({
        ...taunt,
        options: shuffleArray(taunt.options) // Shuffle the answer options
      }))
      .sort(() => Math.random() - 0.5); // Shuffle the taunts themselves
  }

  return function getRandomTaunt() {
    if (currentIndex >= shuffledTaunts.length) {
      // Reshuffle when all taunts are used
      shuffledTaunts = shuffleArrayWithAnswers(taunts);
      currentIndex = 0;
    }

    const taunt = shuffledTaunts[currentIndex];
    currentIndex++;
    return taunt;
  };
}

function getTaunts() {
  return [
    {
      text: "Your loops are inefficient, your scripts always crawl,",
      correctResponse: "But my methods are speedy, I outpace them all.",
      options: [
        "But my methods are speedy, I outpace them all.",
        "Your app’s a disaster, it’ll never install.",
        "Your variables are pointless, they’re always too small.",
        "While my pipelines are flawless, they stand proud and tall."
      ]
    },
    {
      text: "Your database is crashing, your queries are bad,",
      correctResponse: "But my joins are flawless, the best you’ve ever had.",
      options: [
        "But my joins are flawless, the best you’ve ever had.",
        "Your CSS is outdated, it makes me so sad.",
        "While my servers are running, your uptime’s a fad.",
        "Your app’s full of errors, it’s driving me mad."
      ]
    },
    {
      text: "Your front-end’s a disaster, your CSS won’t load,",
      correctResponse: "But my grids are responsive, they lighten the load.",
      options: [
        "But my grids are responsive, they lighten the load.",
        "Your loops are infinite, they’ll crash every node.",
        "Your methods are redundant, they’ll soon erode.",
        "While my functions are sharp, they’ve always been bestowed."
      ]
    },
    {
      text: "Your logic is flawed, your tests always fail,",
      correctResponse: "But my coverage is perfect, I’ll always prevail.",
      options: [
        "But my coverage is perfect, I’ll always prevail.",
        "Your IDE’s a nightmare, it’s slow as a snail.",
        "Your commits are a mess, they leave a long trail.",
        "But my app’s like a rocket, it’s built to set sail."
      ]
    },
    {
      text: "Your repo is chaos, your commits make me weep,",
      correctResponse: "But my branches are clean, a standard I keep.",
      options: [
        "But my branches are clean, a standard I keep.",
        "Your tokens are weak, your secrets will seep.",
        "Your firewall’s a joke, it’s full of a creep.",
        "While my pipelines are stable, my output runs deep."
      ]
    },
    {
      text: "Your app’s unsecure, your tokens are weak,",
      correctResponse: "But my encryption’s unbreakable, the gold you seek.",
      options: [
        "But my encryption’s unbreakable, the gold you seek.",
        "Your grids are unstable, they’re missing a tweak.",
        "Your debugging’s atrocious, it’s reaching its peak.",
        "Your recursion’s a joke, it’ll loop every week."
      ]
    },
    {
      text: "Your cloud’s a dark storm, your servers all crash,",
      correctResponse: "But my autoscaling’s perfect, it handles the bash.",
      options: [
        "But my autoscaling’s perfect, it handles the bash.",
        "Your commits are so sloppy, they make such a splash.",
        "Your encryption is brittle, it’ll crumble to ash.",
        "While my CSS shines, it’s as smooth as a sash."
      ]
    },
    {
      text: "Your pipelines are broken, your deploys never stick,",
      correctResponse:
        "But my workflows are flawless, they’re quick as a click.",
      options: [
        "But my workflows are flawless, they’re quick as a click.",
        "Your queries are failing, they’re making me sick.",
        "Your app’s outdated, it’s built out of brick.",
        "But my debugging is godly, it fixes things quick."
      ]
    },
    {
      text: "Your APIs are bloated, your endpoints are slow,",
      correctResponse: "But my microservices scale, they always outgrow.",
      options: [
        "But my microservices scale, they always outgrow.",
        "Your tests are so fragile, they’re all set to go.",
        "Your encryption is failing, it’s stuck in the flow.",
        "But my variables are magic, they practically glow."
      ]
    },
    {
      text: "Your HTTP’s flaky, your requests always die,",
      correctResponse: "But my queues are robust, they’ll always comply.",
      options: [
        "But my queues are robust, they’ll always comply.",
        "Your tests are so lazy, they’ll barely reply.",
        "While my branches are solid, they reach for the sky.",
        "Your recursion’s so messy, it makes me ask why."
      ]
    },
    {
      text: "Your functions are blocking, they’ll never move fast,",
      correctResponse: "But my async’s so smooth, it was built to outlast.",
      options: [
        "But my async’s so smooth, it was built to outlast.",
        "Your variables are pointless, they’re stuck in the past.",
        "Your database is crumbling, its tables won’t last.",
        "But my CI/CD pipelines are flawlessly cast."
      ]
    },
    {
      text: "Your secrets are public, your code’s a disgrace,",
      correctResponse:
        "But my Vault keeps them hidden, no trace left to chase.",
      options: [
        "But my Vault keeps them hidden, no trace left to chase.",
        "Your repo’s a disaster, it’s lost in deep space.",
        "Your deploys are so broken, they’re a total disgrace.",
        "While my endpoints are seamless, they’ll win every race."
      ]
    },
    {
      text: "Your polling is useless, it’s painfully slow,",
      correctResponse: "But my events are reactive, they’re quick on the go.",
      options: [
        "But my events are reactive, they’re quick on the go.",
        "Your functions are failing, they’ve nothing to show.",
        "Your app’s like a boulder, it’s rolling too slow.",
        "But my loops are unending, they’re starting to glow."
      ]
    },
    {
      text: "Your processes are linear, they take far too long,",
      correctResponse:
        "But my tasks run in parallel, they’re swift and strong.",
      options: [
        "But my tasks run in parallel, they’re swift and strong.",
        "Your stack’s out of balance, it doesn’t belong.",
        "Your recursion’s atrocious, it keeps going wrong.",
        "While my deploys are poetic, they sing a sweet song."
      ]
    }
  ];
}

function handleSkipText() {
  const labels = Object.keys(timeline.labels);
  const nextLabel = getNextLabel();

  if (isAnimating) {
    // Skip character animation
    if (currentTextTimeline) {
      currentTextTimeline.progress(1); // Move timeline to its end
    }

    const textBoxText = document.getElementById("textbox");
    const chars = textBoxText.querySelectorAll(".kb-char");

    // Show all characters immediately
    chars.forEach((char) => {
      char.style.opacity = "1";
    });

    isAnimating = false; // Mark animation as completed
  } else {
    if (nextLabel) {
      timeline.seek(nextLabel); // Seek to the next label
      timeline.play(); // Play from the new label if paused
    }
  }
}

function getNextLabel() {
  const labels = Object.keys(timeline.labels);

  const currentTime = timeline.time();

  const timelineLabels = labels
    .map((label) => ({
      name: label,
      time: timeline.labels[label]
    }))
    .sort((a, b) => a.time - b.time);

  // Find the first label that occurs after the current time
  let nextLabel = null;
  for (let i = 0; i < timelineLabels.length; i++) {
    if (timelineLabels[i].time > currentTime) {
      nextLabel = timelineLabels[i].name;
      break;
    }
  }

  return nextLabel;
}