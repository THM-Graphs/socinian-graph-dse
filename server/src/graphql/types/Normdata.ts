import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";

export const Normdata: GraphQLObjectType = new GraphQLObjectType({
  name: "Normdata",
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: "External identifier for this normdata.",
    },
    label: {
      type: GraphQLString,
      description: "Normdata provider label.",
    },
    namespace: {
      type: GraphQLString,
      description: "Normdata provider namespace.",
    },
    prefix: {
      type: GraphQLString,
      description: "Normdata provider url prefix.",
    },
    wikidata: {
      type: GraphQLString,
      description: "Normdata provider wikidata identifier.",
    },
  }),
});
