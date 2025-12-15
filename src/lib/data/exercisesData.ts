export type ExerciseDataEntry = {
  id: string;
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
    exerciseUrl: "sight-reading",
    title: "Sightreading",
    description: "Play as many correct pitches on the staff as you can! Use your midi keyboard to play, or just use the apps input.",
    iconUrl: "icons/SightreadingIcon.svg",
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
]