// Game State Constants
const LOADING = 0;
const TITLE = 1;
const DIALOGUE = 2;
const EPILOGUE = 3;
const FINISH = "FINISH";

// Game State Management
state = {
  gameStage: LOADING,
  isLoading: true,
  epilogue: null,
  talkingAudio: new Audio(),
  modalTransitionInProgress: false
};

let loadingText = false;

// Loading and Game Start
function donePreloading() {
  if (state.isLoading) {
    state.isLoading = false;
    state.talkingAudio.loop = true;
    state.talkingAudio.src = "sounds/typing.mp3";
    $(".loading-dots").addClass("hidden");
    state.gameStage = TITLE;
    showGameStage();
  }
}

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Title screen ENTER key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && state.gameStage === TITLE) {
            startGame();
        }
    });

    // Start button click handler
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
});

function startGame() {
  state.gameStage = DIALOGUE;
  showGameStage();
  showDialogue(DIALOGUE_CONTENT[0]);
}

// Dialogue Management
function showDialogue(message) {
  try {
    // Clear previous state
    clearListeners();
    $("#character-portrait").removeClass("shifted");
    $("#responses").empty();
    $("#progress-dialogue").addClass("hidden");

    // Update character
    if (message && message.characterImg) {
      $("#character-portrait").css({
        "background-image": `url(${message.characterImg[0]})`,
        "background-position-x": `${message.characterImg[1]}px`,
        "background-position-y": `${message.characterImg[2]}px`,
        "animation": "float 3s ease-in-out infinite"
      });
    }

    // Update text with typing animation
    $("#speaker-name").text(message?.speakerName || "");
    $("#character-dialogue").empty();

    // Ensure message.text is a string and not undefined
    const textToShow = message?.text || "";
    const textArray = Array.from(textToShow); // Use Array.from for proper character splitting
    const timeouts = [];
    loadingText = true;

    // Only play audio if it's properly loaded
    if (state.talkingAudio.readyState >= 2) {
      state.talkingAudio.play().catch(error => console.warn('Audio play failed:', error));
    }

    // Text typing animation with error handling
    let currentText = '';
    textArray.forEach((letter, index) => {
      timeouts.push(
        setTimeout(() => {
          try {
            if (letter) {
              currentText += letter;
              $("#character-dialogue").text(currentText);
            }
          } catch (error) {
            console.error('Error appending letter:', error);
          }
        }, 20 * index)
      );
    });

    timeouts.push(
      setTimeout(() => {
        finishDialogue(message);
      }, 20 * textArray.length)
    );

    // Animation skip handlers
    function skipAnimation() {
      if (loadingText) {
        timeouts.forEach(timeout => clearTimeout(timeout));
        $("#character-dialogue").text(textToShow);
        finishDialogue(message);
      }
    }

    // Setup skip handlers
    document.body.onkeyup = function(e) {
      if (e.code == "Space" || e.code == "Enter") {
        skipAnimation();
      }
    };

    $(".dialogue-wrapper").on("click", function() {
      skipAnimation();
    });

  } catch (error) {
    console.error('Error in showDialogue:', error);
    // Fallback to direct text display without animation
    $("#character-dialogue").text(message?.text || "Error displaying message");
    finishDialogue(message);
  }
}

function finishDialogue(message) {
  loadingText = false;
  if (state.talkingAudio) {
    state.talkingAudio.pause();
    state.talkingAudio.currentTime = 0;
  }
  
  if (message?.options && !areAllModalsOpen() && !state.modalTransitionInProgress) {
    setTimeout(() => {
      $("#character-portrait").addClass("shifted");
      showAvailableOptions();
    }, 500);
  }
}

// Options Management
function showAvailableOptions() {
  $("#responses").empty();
  
  DIALOGUE_OPTIONS.forEach((option) => {
    if (!openModals.some(m => m.title === option.modalContent.title)) {
      const button = document.createElement("button");
      button.innerText = option.text;
      button.addEventListener("click", () => {
        $("#character-portrait").removeClass("shifted");
        selectOption(option);
      });
      $("#responses").append(button);
    }
  });
}

function selectOption(option) {
  if (option.modalContent) {
    if (areAllModalsOpen()) {
      showDialogue(MESSAGES.ALL_OPEN);
      $("#responses").empty();
      return;
    }
    
    if (openModals.some(m => m.title === option.modalContent.title)) {
      showDialogue(MESSAGES.ALREADY_OPEN);
      return;
    }
    
    // Set transition state
    state.modalTransitionInProgress = true;
    
    // Clear existing responses immediately
    $("#responses").empty();
    
    // Show response dialogue
    showDialogue({
      text: option.responseText,
      speakerName: "Pseudoflan",
      characterImg: option.responseSprite,
      options: false  // Prevent showing options while modal is opening
    });
    
    // Create modal after dialogue appears
    setTimeout(() => {
      createModal(option.modalContent);
      // Only show new options after modal is fully created
      setTimeout(() => {
        state.modalTransitionInProgress = false;
        if (!areAllModalsOpen()) {
          showDialogue(MESSAGES.MODAL_CLOSED);
        }
      }, 300);
    }, 1000);
  }
}

// Utility Functions
function clearListeners() {
  document.body.onkeyup = null;
  $(".dialogue-wrapper").off("click");
  $("#progress-dialogue").off("click");
}

function showGameStage() {
  $("#loading").addClass("hidden");
  $("#titlescreen").addClass("hidden");
  $("#dialogue-container").addClass("hidden");
  $("#epilogue").addClass("hidden");

  switch (state.gameStage) {
    case LOADING:
      $("#loading").removeClass("hidden");
      break;
    case TITLE:
      $("#titlescreen").removeClass("hidden");
      break;
    case DIALOGUE:
      $("#dialogue-container").removeClass("hidden");
      break;
    case EPILOGUE:
      $("#epilogue").removeClass("hidden");
      break;
  }
}

function showEpilogue() {
  state.gameStage = EPILOGUE;
  showGameStage();
  const epilogueObject = EPILOGUES.find(
    (epilogue) => epilogue.id === state.epilogue
  );
  $("#epilogue-result").text(epilogueObject.text);
}

function restart() {
  state.gameStage = DIALOGUE;
  state.modalTransitionInProgress = false;
  showGameStage();
  showDialogue(DIALOGUE_CONTENT[0]);
}