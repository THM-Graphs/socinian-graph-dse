import { ENTITY_CATEGORY } from "./ENTITY_CATEGORY";

export const ICON_MAP = {
  person: {
    tag: ENTITY_CATEGORY.PERSON,
    icon: "fa-person",
  },
  bibleVerse: {
    tag: ENTITY_CATEGORY.BIBLE_VERSE,
    icon: "fa-align-center",
  },
  place: {
    tag: ENTITY_CATEGORY.PLACE,
    icon: "fa-map",
  },
  word: {
    tag: ENTITY_CATEGORY.WORD,
    icon: "fa-quote-left",
  },
  text: {
    tag: ENTITY_CATEGORY.TEXT,
    icon: "fa-file-alt",
  },
};

export const getIconByCategory = (category: ENTITY_CATEGORY): string => {
  return Object.values(ICON_MAP).find((entry) => entry.tag === category)?.icon ?? "";
};
