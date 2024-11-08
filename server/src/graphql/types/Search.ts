import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import EntityDAO from '../../database/Entity.dao';
import MetadataDAO from '../../database/Metadata.dao';
import SearchDAO from '../../database/Search.dao';
import { ISearch, ISearchEntity, ISearchLetterEntry } from '../../interfaces/ISearch';
import { Entity } from './Entity';
import { Metadata } from './Metadata';
import { Nullable } from '../../types.js';
import { IEntity } from '../../interfaces/IEntity.js';
import { IMetadata } from '../../interfaces/IMetadata.js';

export const SearchRegisterEntry: GraphQLObjectType = new GraphQLObjectType({
  name: 'SearchRegisterEntry',
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: 'Identifier (usually UUID).',
    },
    label: {
      type: GraphQLString,
      description: 'Search entity label.',
    },
    type: {
      type: GraphQLString,
      description: 'Search entity type.',
    },
    reference: {
      type: Entity,
      description: 'Reference object for current search.',
      resolve: async (context: ISearchEntity): Promise<Nullable<IEntity>> => {
        return await EntityDAO.getEntity(context.guid);
      },
    },
  }),
});

export const SearchLetterEntry: GraphQLObjectType = new GraphQLObjectType({
  name: 'SearchLetterEntry',
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: 'Identifier (usually UUID).',
    },
    label: {
      type: GraphQLString,
      description: 'Search metadata label.',
    },
    occurrences: {
      type: new GraphQLList(GraphQLString),
      description: 'Search metadata occurrences.',
    },
    reference: {
      type: Metadata,
      description: 'Reference object for current search.',
      resolve: async (context: ISearchLetterEntry): Promise<Nullable<IMetadata>> => {
        return await MetadataDAO.getMetadata(context.guid);
      },
    },
  }),
});

export const SearchResult: GraphQLObjectType = new GraphQLObjectType({
  name: 'SearchResult',
  fields: () => ({
    phrase: {
      type: GraphQLString,
      description: 'Used search phrase.',
    },
    letters: {
      type: new GraphQLList(SearchLetterEntry),
      description: 'Search metadata list.',
      resolve: async (context: ISearch): Promise<ISearchLetterEntry[]> => {
        return await SearchDAO.getLetters(context.phrase);
      },
    },
    entities: {
      type: new GraphQLList(SearchRegisterEntry),
      description: 'Search entity list.',
      resolve: async (context: ISearch): Promise<ISearchEntity[]> => {
        return await SearchDAO.getEntities(context.phrase);
      },
    },
  }),
});
