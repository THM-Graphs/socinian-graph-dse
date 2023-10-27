import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from "graphql";
import StandoffPropertyDAO from "../../database/StandoffProperty.dao";
import { IStandoffProperty } from "../../models/IStandoffProperty";
import { Text } from "./Text";

export const StandoffProperty: GraphQLObjectType = new GraphQLObjectType({
  name: "StandoffProperty",
  fields: () => ({
    guid: {
      type: GraphQLNonNull(GraphQLString),
      description: "Identifies the current seleceted property.",
    },
    startIndex: {
      type: GraphQLInt,
      description: "Contains the starting index of the property.",
    },
    endIndex: {
      type: GraphQLInt,
      description: "Contains the ending index of the property.",
    },
    text: {
      type: GraphQLString,
      description: "Contains the text in between of the starting and ending index.",
    },
    teiType: {
      type: GraphQLString,
      description: "tei_type of this property.",
    },
    type: {
      type: GraphQLString,
      description: "type of this property.",
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
    comment: {
      type: Text,
      description: "Contains texts that a references to this property.",
      resolve: async (context: IStandoffProperty) => {
        return await StandoffPropertyDAO.getComment(context.guid);
      },
    },
  }),
});
