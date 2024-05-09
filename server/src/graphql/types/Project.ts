import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const Project: GraphQLObjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Identifier (usually UUID).',
    },
    label: {
      type: GraphQLString,
      description: 'Project text label. Mostly the naming of a category or a headline.',
    },
    text: {
      type: GraphQLString,
      description: 'Project text in markdown notation.',
    },
    data: {
      type: GraphQLString,
      description: 'Project node as string.',
    },
  }),
});
