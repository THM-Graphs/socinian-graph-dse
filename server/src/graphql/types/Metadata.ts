import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from "graphql";
import MetadataDAO from "../../database/Metadata.dao";
import { IMetadata } from "../../models/IMetadata";
import { Participant } from "./Participants";
import { Text } from "./Text";

export const Metadata: GraphQLObjectType = new GraphQLObjectType({
  name: "Metadata",
  fields: () => ({
    guid: {
      type: GraphQLNonNull(GraphQLString),
      description: "Identifies the letterMetadata node.",
    },
    doctype: {
      type: GraphQLString,
      description: "Contains the document type for this metadata.",
    },
    editor: {
      type: GraphQLString,
      description: "Contains the editor responsible for this letter.",
    },
    label: {
      type: GraphQLString,
      description: "Contains a label describing the letter.",
    },
    status: {
      type: GraphQLInt,
      description: "Contains the current status of this letter.",
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
    abstract: {
      type: Text,
      description: "Contains an abstract related to this metadata.",
      resolve: async (context: IMetadata) => {
        return await MetadataDAO.getAbstract(context.guid);
      },
    },
    variants: {
      type: GraphQLList(Text),
      description: "Contains a list of variants related to this metadata.",
      resolve: async (context: IMetadata) => {
        if (context.variants) return context.variants;
        return await MetadataDAO.getVariants(context.guid);
      },
    },
    participants: {
      type: GraphQLList(Participant),
      description: "Contains a list of participants e.g. sender and receiver.",
      resolve: async (context: IMetadata) => {
        return await MetadataDAO.getParticipants(context.guid);
      },
    },
  }),
});
