// Character Sprite Configuration
const PSEUDOFLAN = "./characters/pseudoflan_sprites.png";
const PSEUDOFLAN_SPRITES = {
  normal: [PSEUDOFLAN, 0, 0],     
  happy: [PSEUDOFLAN, -300, 0],    
  neutral: [PSEUDOFLAN, 0, -300],   
  content: [PSEUDOFLAN, -300, -300] 
};

// System Messages for Different States
const MESSAGES = {
  ALL_OPEN: {
    id: 'all-modals',
    text: "You've already opened them all! Take your time to look at them!",
    speakerName: "Pseudoflan",
    characterImg: PSEUDOFLAN_SPRITES.happy
  },
  MODAL_CLOSED: {
    id: 'modal-closed',
    text: "Looks like you can choose again, pick a section!",
    speakerName: "Pseudoflan",
    characterImg: PSEUDOFLAN_SPRITES.content,
    options: true
  },
  ALREADY_OPEN: {
    id: 'already-open',
    text: "Oops! That's already open. Pick another one!",
    speakerName: "Pseudoflan",
    characterImg: PSEUDOFLAN_SPRITES.neutral,
    options: true
  }
};

// Main Navigation Options
const DIALOGUE_OPTIONS = [
  {
    text: "Completed projects",
    modalContent: {
      title: "Completed Projects",
      contentId: "completed-projects-content"
    },
    responseText: "Here are POLLYGON's completed projects! They only come once in a blue moon…",
    responseSprite: PSEUDOFLAN_SPRITES.content
  },
  {
    text: "Ongoing projects",
    modalContent: {
      title: "Ongoing Projects",
      contentId: "ongoing-projects-content"
    },
    responseText: "Here we have POLLYGON's ongoing projects. They haven't been continued because he's busy with life… or maybe pure laziness.",
    responseSprite: PSEUDOFLAN_SPRITES.normal
  },
  {
    text: "Rough ideas",
    modalContent: {
      title: "Rough Ideas",
      contentId: "rough-ideas-content"
    },
    responseText: "These are some of POLLYGON's rough ideas for a project! Whether they'll come to life or not is unknown…",
    responseSprite: PSEUDOFLAN_SPRITES.neutral
  }
];

// Initial Dialogue Content
const DIALOGUE_CONTENT = [
  {
    id: 1,
    text: "Welcome to Pollygon Project Corner! What would you like to view?",
    speakerName: "Pseudoflan",
    characterImg: PSEUDOFLAN_SPRITES.neutral,
    options: true
  }
];

const EPILOGUES = [];