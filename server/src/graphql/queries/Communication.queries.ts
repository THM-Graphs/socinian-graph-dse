import { GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import CommunicationDAO from '../../database/Communication.dao';
import { Communication } from '../types/Communication';
import { ICommunication } from '../../interfaces/ICommunication.js';
import { Nullable } from '../../types.js';

export const CommunicationQueries: GraphQLFieldConfigMap<string, string> = {
  communications: {
    type: new GraphQLList(Communication),
    resolve: async (): Promise<ICommunication[]> => {
      return await CommunicationDAO.getCommunications();
    },
  },

  communication: {
    type: Communication,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<ICommunication>> => {
      const communicationId: string = filterXSS(args.id);
      return await CommunicationDAO.getCommunication(communicationId);
    },
  },
};
