import { GraphQLObjectType, GraphQLString } from "graphql";
import { Entity } from "./Entity";

export const Participant: GraphQLObjectType = new GraphQLObjectType({
  name: "Participant",
  fields: () => ({
    type: {
      type: GraphQLString,
      description: "Contains the type of the participant.",
    },
    dateStart: {
      type: GraphQLString,
      description: "Contains the date the participant has started to act.",
    },
    dateEnd: {
      type: GraphQLString,
      description: "Contains the date the participant has ended to act.",
    },
    dateCertainty: {
      type: GraphQLString,
      description:
        "Contains the certainty for the dates the participant has acted within.",
    },
    dateType: {
      type: GraphQLString,
      description: "Contains the type of dates, e.g. point or range.",
    },
    person: {
      type: Entity,
      description:
        "Contains the person entity related to this participant entry.",
    },
    place: {
      type: Entity,
      description:
        "Contains the place entity related to this participant entry.",
    },
  }),
});
