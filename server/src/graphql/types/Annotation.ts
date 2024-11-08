import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import AnnotationDAO from '../../database/Annotation.dao.js';
import { IAnnotation } from '../../interfaces/IAnnotation.js';
import { Text } from './Text';
import { IText } from '../../interfaces/IText.js';
import { Nullable } from '../../types.js';

export const Annotation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Annotation',
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Identifier (usually UUID).',
    },
    startIndex: {
      type: GraphQLInt,
      description: 'Annotation starting index.',
    },
    endIndex: {
      type: GraphQLInt,
      description: 'Annotation ending index.',
    },
    isZeroPoint: {
      type: GraphQLBoolean,
      description: 'Is annotation zero point?',
    },
    text: {
      type: GraphQLString,
      description: 'Annotated text.',
    },
    teiType: {
      type: GraphQLString,
      description: 'Annotation TEI type.',
    },
    type: {
      type: GraphQLString,
      description: 'Annotation ATAG type.',
    },
    data: {
      type: GraphQLString,
      description: 'Annotation node as string.',
    },
    comment: {
      type: Text,
      description: 'Annotation related text node.',
      resolve: async (context: IAnnotation): Promise<Nullable<IText>> => {
        return await AnnotationDAO.getComment(context.guid);
      },
    },
  }),
});
