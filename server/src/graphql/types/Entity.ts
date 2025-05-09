import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import EntityDAO from '../../database/Entity.dao';
import { IAdditionalLabel, IEntity } from '../../interfaces/IEntity';
import { Metadata } from './Metadata';
import { Normdata } from './Normdata';
import { IMetadata } from '../../interfaces/IMetadata.js';
import { INormdata } from '../../interfaces/INormdata.js';
import { Annotation } from './Annotation.js';
import { IAnnotation } from '../../interfaces/IAnnotation.js';

const AdditionalLabel: GraphQLObjectType = new GraphQLObjectType({
  name: 'AdditionalLabel',
  fields: () => ({
    foreName: {
      type: GraphQLString,
      description: 'Entity forename.',
    },
    surname: {
      type: GraphQLString,
      description: 'Entity surname.',
    },
    label: {
      type: GraphQLString,
      description: 'Entity label.',
    },
  }),
});

export const Entity: GraphQLObjectType = new GraphQLObjectType({
  name: 'Entity',
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: 'Identifier (usually UUID).',
    },
    label: {
      type: GraphQLString,
      description: 'Entity label.',
    },
    type: {
      type: GraphQLString,
      description: 'Entity type.',
    },
    mentions: {
      type: GraphQLInt,
      description: 'Amount of mentions of this entity in distinct letters.',
    },
    remarks: {
      type: GraphQLInt,
      description: 'Amount of remarks of this entity in distinct letters.',
    },
    annotations: {
      type: new GraphQLList(Annotation),
      description: 'Annotations related to this entity.',
      resolve: async (context: IEntity): Promise<IAnnotation[]> => {
        if (context.annotations) return context.annotations;
        return await EntityDAO.getAnnotations(context.annotations);
      },
    },
    mentionedBy: {
      type: new GraphQLList(Metadata),
      description: 'Entity mentions in metadata nodes.',
      resolve: async (context: IEntity): Promise<IMetadata[]> => {
        if (context.mentionedBy) return context.mentionedBy;
        return await EntityDAO.getMentionedBy(context.guid);
      },
    },
    remarkedBy: {
      type: new GraphQLList(Metadata),
      description: 'Entity remarks in metadata nodes.',
      resolve: async (context: IEntity): Promise<IMetadata[]> => {
        if (context.remarkedBy) return context.remarkedBy;
        return await EntityDAO.getRemarkedBy(context.guid);
      },
    },
    normdata: {
      type: new GraphQLList(Normdata),
      description: 'Entity normdata combined with its prover.',
      resolve: async (context: IEntity): Promise<INormdata[]> => {
        return await EntityDAO.getNormdata(context.guid);
      },
    },
    additionalLabels: {
      type: new GraphQLList(AdditionalLabel),
      description: 'List of additional labels.',
      resolve: async (context: IEntity): Promise<IAdditionalLabel[]> => {
        return await EntityDAO.getAdditionalLabels(context.guid);
      },
    },
    additionalInformation: {
      type: new GraphQLList(GraphQLString),
      description: 'List of strings with additional information.',
      resolve: async (context: IEntity): Promise<string[]> => {
        return await EntityDAO.getAdditionalInformation(context.guid);
      },
    },
    data: {
      type: GraphQLString,
      description: 'Entity node as string.',
    },
  }),
});
