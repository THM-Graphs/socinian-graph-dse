import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import EntityDAO from '../../database/Entity.dao';
import { Entity } from '../types/Entity';
import { EntityType, IEntity } from '../../interfaces/IEntity.js';
import { Nullable } from '../../types.js';

export const EntityQueries: GraphQLFieldConfigMap<string, string> = {
  entities: {
    type: new GraphQLList(Entity),
    args: { type: { type: GraphQLString }, isDetailed: { type: GraphQLBoolean } },
    resolve: async (_, args: { type: EntityType; isDetailed: boolean }): Promise<IEntity[]> => {
      const type: EntityType = filterXSS(args?.type ?? '') as EntityType;
      if (args?.isDetailed) return EntityDAO.getDetailedEntities(type);
      return EntityDAO.getEntities(type);
    },
  },

  entity: {
    type: Entity,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IEntity>> => {
      const entityId: string = filterXSS(args?.id ?? '');
      return await EntityDAO.getEntity(entityId);
    },
  },
};
