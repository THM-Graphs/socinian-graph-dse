import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import AnnotationDAO from '../../database/Annotation.dao.js';
import TextDAO from '../../database/Text.dao';
import { IText } from '../../interfaces/IText';
import { Metadata } from './Metadata';
import { Annotation } from './Annotation.js';
import { Nullable } from '../../types.js';
import { IAnnotation } from '../../interfaces/IAnnotation.js';
import { IMetadata } from '../../interfaces/IMetadata.js';

export const Text: GraphQLObjectType = new GraphQLObjectType({
  name: 'Text',
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Identifier (usually UUID).',
    },
    label: {
      type: GraphQLString,
      description: 'Text node label.',
    },
    metadataLanguage: {
      type: GraphQLString,
      description: 'Text node language.',
    },
    metadataLicence: {
      type: GraphQLString,
      description: 'Text node licence.',
    },
    metadataShelfmark: {
      type: GraphQLString,
      description: 'Text node shelfmark.',
    },
    text: {
      type: GraphQLString,
      description: 'Plain text.',
    },
    metadataTextGenre: {
      type: GraphQLString,
      description: 'Text node genre.',
    },
    metadataTextType: {
      type: GraphQLString,
      description: 'Text node type.',
    },
    metadataArchive: {
      type: GraphQLString,
      description: 'Text node archive.',
    },
    metadataIsReference: {
      type: GraphQLBoolean,
      description: 'Is text node a reference?',
    },
    metadataPrintSourceName: {
      type: GraphQLString,
      description: 'Text node print source.',
    },
    metadataPrintSourceUrl: {
      type: GraphQLString,
      description: 'Text node source url.',
    },
    metadataFunder: {
      type: GraphQLString,
      description: 'Text node funder.',
    },
    metadataRemark: {
      type: Text,
      description: 'Text node editor remarks.',
      resolve: async (context: IText): Promise<Nullable<IText>> => {
        return await TextDAO.getRemark(context.guid);
      },
    },
    data: {
      type: GraphQLString,
      description: 'Text node as string.',
    },
    standoffProperties: {
      type: new GraphQLList(Annotation),
      description: 'Text node annotations.',
      resolve: async (context: IText): Promise<IAnnotation[]> => {
        return await AnnotationDAO.getAnnotations(context.guid);
      },
    },
    letter: {
      type: Metadata,
      description: 'Linked letter to this text node.',
      resolve: async (context: IText): Promise<Nullable<IMetadata>> => {
        if (context.letter) return context.letter;
        return await TextDAO.getMetadata(context.guid);
      },
    },
  }),
});
