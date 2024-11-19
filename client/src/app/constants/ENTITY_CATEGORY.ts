import { LangManager } from '../../utils/LangManager';

export enum ENTITY_CATEGORY {
  BIBLE_VERSE = 'bible_verse',
  PLACE = 'place',
  PERSON = 'person',
  WORD = 'term',
  TEXT = 'text',
}

export const getTranslationByCategory = (category: ENTITY_CATEGORY): string => {
  switch (category) {
    case ENTITY_CATEGORY.BIBLE_VERSE:
      return LangManager.get('ENTITY_CATEGORY_BIBLE_VERSE');

    case ENTITY_CATEGORY.PERSON:
      return LangManager.get('ENTITY_CATEGORY_PERSON');

    case ENTITY_CATEGORY.PLACE:
      return LangManager.get('ENTITY_CATEGORY_PLACE');

    case ENTITY_CATEGORY.TEXT:
      return LangManager.get('ENTITY_CATEGORY_TEXT');

    case ENTITY_CATEGORY.WORD:
      return LangManager.get('ENTITY_CATEGORY_WORD');

    default:
      return '';
  }
};
