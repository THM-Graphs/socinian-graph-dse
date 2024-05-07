import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString,} from "graphql";
import CommunicationDAO from "../../database/Communication.dao";
import {ICommunication} from "../../models/ICommunication";
import {Metadata} from "./Metadata";

export const Communication: GraphQLObjectType = new GraphQLObjectType({
  name: "Communication",
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Identifies the current selected communication node.",
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
    letter: {
      type: Metadata,
      description: "Yields letter metadata related to this communication.",
      resolve: async (context: ICommunication) => {
        if (context.letter) return context.letter;
        return await CommunicationDAO.getLetter(context.guid);
      },
    },
    attachments: {
      type: new GraphQLList(Metadata),
      description: "Yields attachment metadata attached to this communication.",
      resolve: async (context: ICommunication) => {
        if (context.attachments) return context.attachments;
        return await CommunicationDAO.getAttachments(context.guid);
      },
    },
  }),
});
