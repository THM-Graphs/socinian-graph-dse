import {GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString,} from "graphql";
import {filterXSS} from "xss";
import EntityDAO from "../../database/Entity.dao";
import {Entity} from "../types/Entity";

export const EntityQueries: GraphQLFieldConfigMap<string, string> = {
  entities: {
    type: new GraphQLList(Entity),
    args: {
      type: { type: GraphQLString },
    },
    resolve: async (_, args: { type: string }) => {
      const type = filterXSS(args?.type);
      return EntityDAO.getEntities(type);
    },
  },
  entity: {
    type: Entity,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const entityId = filterXSS(args?.id);
      return await EntityDAO.getEntity(entityId);
    },
  },
};
