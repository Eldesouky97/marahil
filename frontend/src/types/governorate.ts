export type GovernorateId =
  | "cairo"
  | "giza"
  | "alexandria"
  | "qalyubia"
  | "portSaid"
  | "suez"
  | "dakahlia"
  | "sharqia"
  | "gharbia"
  | "monufia"
  | "beheira"
  | "kafrElSheikh"
  | "damietta"
  | "ismailia"
  | "fayoum"
  | "beniSuef"
  | "minya"
  | "assiut"
  | "sohag"
  | "qena"
  | "luxor"
  | "aswan"
  | "redSea"
  | "newValley"
  | "matrouh"
  | "northSinai"
  | "southSinai";

export interface Governorate {
  id: GovernorateId;
  label: string;
}
