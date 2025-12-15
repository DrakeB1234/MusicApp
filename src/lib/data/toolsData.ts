export type ToolsDataEntry = {
  id: string;
  url: string;
  title: string;
  iconUrl: string;
}

export const toolsData: ToolsDataEntry[] = [
  {
    id: "c86d4a56-4ded-443b-8163-354fb3137181",
    url: "metronome",
    title: "Metronome",
    iconUrl: "icons/RhythmIcon.svg",
  },
  {
    id: "cb56bb8d-59b1-451b-8b98-b79547a1b162",
    url: "scales-creator",
    title: "Scales Creator",
    iconUrl: "icons/ScalesIcon.svg",
  },
  {
    id: "4b49951d-bb3d-4009-ba1d-4a9fbb911cfd",
    url: "digital-piano",
    title: "Digital Piano",
    iconUrl: "icons/PianoIcon.svg",
  }
]