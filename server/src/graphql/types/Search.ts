import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import EntityDAO from "../../database/Entity.dao";
import MetadataDAO from "../../database/Metadata.dao";
import SearchDAO from "../../database/Search.dao";
import { ISearch, ISearchLetterEntry, ISearchEntity } from "../../models/ISearch";
import { Entity } from "./Entity";
import { Metadata } from "./Metadata";

export const SearchRegisterEntry: GraphQLObjectType = new GraphQLObjectType({
  name: "SearchRegisterEntry",
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: "Identifies the register entity.",
    },
    label: {
      type: GraphQLString,
      description: "Contains the label of the found entity.",
    },
    type: {
      type: GraphQLString,
      description: "Contains the type of the found entity.",
    },
    reference: {
      type: Entity,
      description: "Reference object of current search.",
      resolve: async (context: ISearchEntity) => {
        return await EntityDAO.getEntity(context.guid);
      },
    },
  }),
});

export const SearchLetterEntry: GraphQLObjectType = new GraphQLObjectType({
  name: "SearchLetterEntry",
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: "Identifies a letter looked up by phrase.",
    },
    label: {
      type: GraphQLString,
      description: "Contains the label of the found letter.",
    },
    occurrences: {
      type: GraphQLList(GraphQLString),
      description: "Text where the search phrase has been found.",
    },
    reference: {
      type: Metadata,
      description: "Reference object of current search.",
      resolve: async (context: ISearchLetterEntry) => {
        return await MetadataDAO.getMetadata(context.guid);
      },
    },
  }),
});

export const SearchResult: GraphQLObjectType = new GraphQLObjectType({
  name: "SearchResult",
  fields: () => ({
    phrase: {
      type: GraphQLString,
      description: "Contains the used searchPhrase.",
    },
    letters: {
      type: GraphQLList(SearchLetterEntry),
      description: "List of results for letters",
      resolve: async (context: ISearch) => {
        return await SearchDAO.getLetters(context.phrase);
      },
    },
    entities: {
      type: GraphQLList(SearchRegisterEntry),
      description: "List of results for register entries",
      resolve: async (context: ISearch) => {
        return await SearchDAO.getEntities(context.phrase);
      },
    },
  }),
});
