import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import EntityDAO from "../../database/Entity.dao";
import {IEntity} from "../../models/IEntity";
import {Metadata} from "./Metadata";
import {Normdata} from "./Normdata";

const AdditionalLabel: GraphQLObjectType = new GraphQLObjectType({
  name: "AdditionalLabel",
  fields: () => ({
    foreName: {
      type: GraphQLString,
      description: "Contains a forename.",
    },
    surname: {
      type: GraphQLString,
      description: "Contains a surname.",
    },
    label: {
      type: GraphQLString,
      description: "Contains a label.",
    },
  }),
});

export const Entity: GraphQLObjectType = new GraphQLObjectType({
  name: "Entity",
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: "Identifies the current selected entity.",
    },
    label: {
      type: GraphQLString,
      description: "Contains the label of the current selected entity.",
    },
    type: {
      type: GraphQLString,
      description: "Contains the type of this entity.",
    },
    occurrences: {
      type: new GraphQLList(Metadata),
      description: "Contains all letter occurrences for this entity.",
      resolve: async (context: IEntity) => {
        if (context.occurrences) return context.occurrences;
        return await EntityDAO.getOccurrences(context.guid);
      },
    },
    normdata: {
      type: new GraphQLList(Normdata),
      description: "Contains the normdata object for this entity.",
      resolve: async (context: IEntity) => {
        return await EntityDAO.getNormdata(context.guid);
      },
    },
    additionalLabels: {
      type: new GraphQLList(AdditionalLabel),
      description: "Contains a list of additional labels for this entity.",
      resolve: async (context: IEntity) => {
        return await EntityDAO.getAdditionalLabels(context.guid);
      },
    },
    additionalInformation: {
      type: new GraphQLList(GraphQLString),
      description: "Contains a list of strings with additional information.",
      resolve: async (context: IEntity) => {
        return await EntityDAO.getAdditionalInformation(context.guid);
      },
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
  }),
});
