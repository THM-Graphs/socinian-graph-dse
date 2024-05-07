import {GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString,} from "graphql";
import StandoffPropertyDAO from "../../database/StandoffProperty.dao";
import TextDAO from "../../database/Text.dao";
import {IText} from "../../models/IText";
import {Metadata} from "./Metadata";
import {StandoffProperty} from "./StandoffProperty";

export const Text: GraphQLObjectType = new GraphQLObjectType({
  name: "Text",
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Identifies the text node.",
    },
    label: {
      type: GraphQLString,
      description: "Label for this text.",
    },
    metadataLanguage: {
      type: GraphQLString,
      description: "Language of this text.",
    },
    metadataLicence: {
      type: GraphQLString,
      description: "License for this text.",
    },
    metadataShelfmark: {
      type: GraphQLString,
      description: "Shelfmark for this text.",
    },
    text: {
      type: GraphQLString,
      description: "Containing the text of this text.",
    },
    metadataTextGenre: {
      type: GraphQLString,
      description: "Containing the current genre for this text.",
    },
    metadataTextType: {
      type: GraphQLString,
      description: "Type of the current text text.",
    },
    metadataArchive: {
      type: GraphQLString,
      description: "Contains the archive of this text.",
    },
    metadataIsReference: {
      type: GraphQLBoolean,
      description: "Defines if the current text is a reference.",
    },
    metadataPrintSourceName: {
      type: GraphQLString,
      description: "Contains the print source name for this text.",
    },
    metadataPrintSourceUrl: {
      type: GraphQLString,
      description: "Contains the print source url for this text.",
    },
    metadataRemark: {
      type: Text,
      description: "Remark of the editor.",
      resolve: async (context: IText) => {
        return await TextDAO.getRemark(context.guid);
      },
    },
    data: {
      type: GraphQLString,
      description: "Contains a stringified copy of the neo4j object.",
    },
    standoffProperties: {
      type: new GraphQLList(StandoffProperty),
      description:
        "Containing the standoff properties associated with this text.",
      resolve: async (context: IText) => {
        return await StandoffPropertyDAO.getProperties(context.guid);
      },
    },
    letter: {
      type: Metadata,
      description: "Contains the letter this text has been linked to.",
      resolve: async (context: IText) => {
        if (context.letter) return context.letter;
        return await TextDAO.getLetter(context.guid);
      },
    },
  }),
});
