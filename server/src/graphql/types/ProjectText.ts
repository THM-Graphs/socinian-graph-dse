import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";

export const ProjectText: GraphQLObjectType = new GraphQLObjectType({
  name: "ProjectText",
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Identifies the current selected project text.",
    },
    label: {
      type: GraphQLString,
      description:
        "Project text label. Mostly the naming of a category or the headline of this text.",
    },
    text: {
      type: GraphQLString,
      description: "MD formatted text => contains the project text.",
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
  }),
});
