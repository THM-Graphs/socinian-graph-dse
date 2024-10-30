import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import MetadataDAO from '../../database/Metadata.dao';
import { IMetadata } from '../../interfaces/IMetadata';
import { Participant } from './Participants';
import { Text } from './Text';
import { Nullable } from '../../types.js';
import { IText } from '../../interfaces/IText';
import { IParticipant } from '../../interfaces/IParticipant';
import { Communication } from './Communication';
import { ICommunication } from '../../interfaces/ICommunication';

export const Metadata: GraphQLObjectType = new GraphQLObjectType({
  name: 'Metadata',
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Identifier (usually UUID).',
    },
    doctype: {
      type: GraphQLString,
      description: 'Metadata document type.',
    },
    editor: {
      type: GraphQLString,
      description: 'Metadata responsible editor.',
    },
    label: {
      type: GraphQLString,
      description: 'Metadata label.',
    },
    status: {
      type: GraphQLInt,
      description: 'Metadata current in-work-status as integer.',
    },
    data: {
      type: GraphQLString,
      description: 'Metadata node as string.',
    },
    abstract: {
      type: Text,
      description: 'Metadata abstract.',
      resolve: async (context: IMetadata): Promise<Nullable<IText>> => {
        return await MetadataDAO.getAbstract(context.guid);
      },
    },
    variants: {
      type: new GraphQLList(Text),
      description: 'Metadata variants.',
      resolve: async (context: IMetadata): Promise<IText[]> => {
        if (context.variants) return context.variants;
        return await MetadataDAO.getVariants(context.guid);
      },
    },
    participants: {
      type: new GraphQLList(Participant),
      description: 'Metadata participants, e.g., places and persons.',
      resolve: async (context: IMetadata): Promise<IParticipant[]> => {
        if (context.participants) return context.participants;
        return await MetadataDAO.getParticipants(context.guid);
      },
    },
    attachedBy: {
      type: new GraphQLList(Communication),
      description: 'Metadata attached by communications.',
      resolve: async (context: IMetadata): Promise<ICommunication[]> => {
        if (context.attachedBy) return context.attachedBy;
        return await MetadataDAO.getAttachedBy(context.guid);
      },
    },
  }),
});
