export type ExerciseDataEntry = {
  id: string;
  color: string;
  exerciseUrl: string;
  title: string;
  description: string;
  iconUrl: string;
  tutorial: TutorialSection[];
}

export type TutorialSection = {
  header: string;
  text: string[];
};

export const exercisesData: ExerciseDataEntry[] = [
  {
    id: "a8d49c42-e11e-446e-aa96-7137debdc937",
    color: "var(--color-primary-light)",
    exerciseUrl: "note-recognition",
    title: "Note Recognition",
    description: "Play as many correct pitches on the staff as you can! Use your midi keyboard to play, or just use the apps input.",
    iconUrl: "icons/NoteRecognitionIcon.svg",
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "A note will appear on the staff on screen on start",
          "You must press/play the correct corresponding note to earn points.",
          "Get as many answers in 60 seconds!"
        ]
      },
      {
        header: "Scoring",
        text: [
          "The faster you answer, the bigger the bonus points are.",
          "The harder difficulty options will provide more points",
        ]
      },
    ]
  },
  {
    id: "a6c47632-8c34-44eb-b698-6323c27d804f",
    color: "var(--color-primary-light)",
    exerciseUrl: "sight-reading",
    title: "Sight Reading",
    description: "Play as many correct pitches on the staff as you can on the scrolling staff! Use your midi keyboard to play, or just use the apps input.",
    iconUrl: "icons/SightReadingIcon.svg",
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "A note will appear on the staff on screen on start",
          "You must press/play the correct corresponding note to earn points.",
          "Get as many answers in 60 seconds!"
        ]
      },
      {
        header: "Scoring",
        text: [
          "The faster you answer, the bigger the bonus points are.",
          "The harder difficulty options will provide more points",
        ]
      },
    ]
  },
  {
    id: "3d30f957-c589-43f6-b3f4-b5f37c2feb21",
    color: "var(--color-icon-green)",
    exerciseUrl: "rhythm-training",
    title: "Rhythm Training",
    description: "Play the correct rhythm and play as long as you don't run out of tries!",
    iconUrl: "icons/RhythmIcon.svg",
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "Click the start button to begin the exercise.",
          "A rhythm will appear on screen, then after 4 beats, you must tap the beat to the corresponding notes.",
          "After failing 4 times, you get a game over!.",
        ]
      },
      {
        header: "Scoring",
        text: [
          "The bigger the streak of correct attempts, the bigger the score bonus!",
          "The harder difficulty options will provide more points.",
        ]
      },
    ]
  },
  {
    id: "09ce13ff-2545-4259-91be-d218a8473fe8",
    color: "var(--color-icon-orange)",
    exerciseUrl: "chord-guesser",
    title: "Chord Guesser",
    description: "Play the correct chord shown on the staff. You can use your keyboard on this one!",
    iconUrl: "icons/ChordIcon.svg",
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "Click the start button to begin the exercise.",
          "A rhythm will appear on screen, then after 4 beats, you must tap the beat to the corresponding notes.",
          "After failing 4 times, you get a game over!.",
        ]
      },
      {
        header: "Scoring",
        text: [
          "The bigger the streak of correct attempts, the bigger the score bonus!",
          "The harder difficulty options will provide more points.",
        ]
      },
    ]
  },
  {
    id: "373c9955-4dd8-46ef-a65b-42d4cba67725",
    color: "var(--color-icon-yellow)",
    exerciseUrl: "intervals-drill",
    title: "Intervals Drill",
    description: "Play the correct interval based on the two notes played. Great for learning the difference in two notes on the fly!",
    iconUrl: "icons/IntervalsIcon.svg",
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "Click the start button to begin the exercise.",
          "Two notes will be played, the root and the interval. Guess the correct interval in as much time as you need.",
          "You can replay the interval as many times as you need.",
          "After failing 3 times, you get a game over!.",
        ]
      },
      {
        header: "Scoring",
        text: [
          "The bigger the streak of correct attempts, the bigger the score bonus!",
          "The harder difficulty options will provide more points.",
        ]
      },
    ]
  },
]