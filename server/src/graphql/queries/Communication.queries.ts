import {GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString,} from "graphql";
import {filterXSS} from "xss";
import CommunicationDAO from "../../database/Communication.dao";
import {Communication} from "../types/Communication";

export const CommunicationQueries: GraphQLFieldConfigMap<string, string> = {
  communications: {
    type: new GraphQLList(Communication),
    resolve: async () => {
      return await CommunicationDAO.getCommunications();
    },
  },
  communication: {
    type: Communication,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const communicationId: string = filterXSS(args.id);
      return await CommunicationDAO.getCommunication(communicationId);
    },
  },
};
