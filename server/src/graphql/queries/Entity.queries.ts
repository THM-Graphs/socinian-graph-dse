import { GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import EntityDAO from '../../database/Entity.dao';
import { Entity } from '../types/Entity';
import { EntityType, IEntity } from '../../interfaces/IEntity.js';
import { Nullable } from '../../types.js';

export const EntityQueries: GraphQLFieldConfigMap<string, string> = {
  entities: {
    type: new GraphQLList(Entity),
    args: { type: { type: GraphQLString } },
    resolve: async (_, args: { type: EntityType }): Promise<IEntity[]> => {
      const type: EntityType = filterXSS(args?.type ?? '') as EntityType;
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
