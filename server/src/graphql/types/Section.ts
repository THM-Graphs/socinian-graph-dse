import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import SectionDAO from "../../database/Section.dao";
import { ISection } from "../../models/ISection";
import { Communication } from "./Communication";
import { ICommunication } from "../../models/ICommunication";
import { StandoffProperty } from "./StandoffProperty";

export const Section: GraphQLObjectType = new GraphQLObjectType({
  name: "Section",
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: "Identifies the current selected section.",
    },
    label: {
      type: GraphQLString,
      description: "Provides a label for the current selected section.",
    },
    text: {
      type: GraphQLString,
      description: "Provides the description of this section.",
    },
    standoffProperties: {
      type: GraphQLList(StandoffProperty),
      description: "SPO for the provided description of this text.",
      resolve: async (context: ISection) => {
        return await SectionDAO.getProperties(context.guid);
      },
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
    children: {
      type: GraphQLList(Section),
      description: "Contains a list of children related to the selected section.",
      resolve: async (context: ISection) => {
        return await SectionDAO.getChildren(context.guid);
      },
    },
    communications: {
      type: GraphQLList(Communication),
      description: "List contains communications categorized by sections.",
      resolve: async (context: ISection) => {
        const communications: ICommunication[] = await SectionDAO.getCommunication(context.guid);
        return communications ?? [];
      },
    },
  }),
});
