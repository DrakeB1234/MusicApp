export type ExerciseDataEntry = {
  id: string;
  exerciseUrl: string;
  title: string;
  description: string;
  iconUrl: string;
  availableInputs: InputTypes[];
  tutorial: TutorialSection[];
}

export type TutorialSection = {
  header: string;
  text: string[];
};

export type InputTypes = "MIDI" | "Piano" | "Buttons";

export const exercisesData: ExerciseDataEntry[] = [
  {
    id: "a8d49c42-e11e-446e-aa96-7137debdc937",
    exerciseUrl: "sightreading",
    title: "Sightreading",
    description: "Multiple notes are played simultaneously. Can you identify the chord? Click on the right answer.",
    iconUrl: "icons/SightreadingIcon.svg",
    availableInputs: ["MIDI", "Buttons", "Piano"],
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "A note will appear on the staff on screen on start",
          "You must press/play the correct corresponding note to earn points.",
          "Get 3 notes wrong, and you lose!"
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
    exerciseUrl: "rhythmtraining",
    title: "Rhythm Training",
    description: "Multiple notes are played simultaneously. Can you identify the chord? Click on the right answer.",
    iconUrl: "icons/RhythmIcon.svg",
    availableInputs: ["Buttons"],
    tutorial: [
      {
        header: "Gameplay Mechanics",
        text: [
          "A note will appear on the staff on screen on start",
          "You must press/play the correct corresponding note to earn points.",
          "Get 3 notes wrong, and you lose!"
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
]