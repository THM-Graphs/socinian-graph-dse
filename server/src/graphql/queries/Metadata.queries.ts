import {GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString} from "graphql";
import {filterXSS} from "xss";
import MetadataDAO from "../../database/Metadata.dao";
import {Metadata} from "../types/Metadata";

export const MetadataQueries: GraphQLFieldConfigMap<string, string> = {
  metadata: {
    type: Metadata,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const metadataId: string = filterXSS(args.id);
      return await MetadataDAO.getMetadata(metadataId);
    },
  },
};
