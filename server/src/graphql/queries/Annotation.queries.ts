import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from 'graphql';
import AnnotationDAO from '../../database/Annotation.dao.js';
import { Entity } from '../types/Entity';
import { Text } from '../types/Text';
import { filterXSS } from 'xss';
import { IEntity } from '../../interfaces/IEntity.js';
import { Nullable } from '../../types.js';
import { IText } from '../../interfaces/IText.js';

export const AnnotationQueries: GraphQLFieldConfigMap<string, string> = {
  refersEntity: {
    type: Entity,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IEntity>> => {
      const annotationId: string = filterXSS(args.id);
      return AnnotationDAO.getEntity(annotationId);
    },
  },

  refersText: {
    type: Text,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IText>> => {
      const annotationId: string = filterXSS(args.id);
      return AnnotationDAO.getText(annotationId);
    },
  },

  refersComment: {
    type: Text,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IText>> => {
      const annotationId: string = filterXSS(args.id);
      return AnnotationDAO.getComment(annotationId);
    },
  },

  refersReference: {
    type: Text,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IText>> => {
      const annotationId: string = filterXSS(args.id);
      return AnnotationDAO.getReference(annotationId);
    },
  },
};
