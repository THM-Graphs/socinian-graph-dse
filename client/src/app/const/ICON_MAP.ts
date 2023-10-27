import { ENTITY_TYPES } from "./ENTITY_TYPES";

export const ICON_MAP = {
  person: {
    tag: ENTITY_TYPES.person,
    icon: "fa-person",
  },
  bibleVerse: {
    tag: ENTITY_TYPES.bibleVerse,
    icon: "fa-align-center",
  },
  place: {
    tag: ENTITY_TYPES.place,
    icon: "fa-map",
  },
  word: {
    tag: ENTITY_TYPES.word,
    icon: "fa-quote-left",
  },
  text: {
    tag: "text",
    icon: "fa-file-alt",
  },
};

export const getIconByType = (type: string): string => {
  return Object.values(ICON_MAP).find((entry) => entry.tag === type)?.icon ?? "";
};
