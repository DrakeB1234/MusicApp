export type ToolsDataEntry = {
  id: string;
  color: string;
  url: string;
  title: string;
  iconId: string;
}

export const toolsData: ToolsDataEntry[] = [
  {
    id: "c86d4a56-4ded-443b-8163-354fb3137181",
    color: "#7cd953",
    url: "metronome",
    title: "Metronome",
    iconId: "rhythm-training",
  },
  {
    id: "cb56bb8d-59b1-451b-8b98-b79547a1b162",
    color: "var(--color-primary-light)",
    url: "scales-viewer",
    title: "Scales Viewer",
    iconId: "scales",
  },
  {
    id: "4b49951d-bb3d-4009-ba1d-4a9fbb911cfd",
    color: "var(--color-primary-light)",
    url: "digital-piano",
    title: "Digital Piano",
    iconId: "piano",
  }
]