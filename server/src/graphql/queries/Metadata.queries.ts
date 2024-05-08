import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import MetadataDAO from '../../database/Metadata.dao';
import { Metadata } from '../types/Metadata';
import { Nullable } from '../../types.js';
import { IMetadata } from '../../interfaces/IMetadata.js';

export const MetadataQueries: GraphQLFieldConfigMap<string, string> = {
  metadata: {
    type: Metadata,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IMetadata>> => {
      const metadataId: string = filterXSS(args.id);
      return await MetadataDAO.getMetadata(metadataId);
    },
  },
};
