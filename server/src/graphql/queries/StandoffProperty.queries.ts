import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from "graphql";
import StandoffPropertyDAO from "../../database/StandoffProperty.dao";
import { Entity } from "../types/Entity";
import { Text } from "../types/Text";
import { filterXSS } from "xss";

export const StandoffPropertyQueries: GraphQLFieldConfigMap<string, string> = {
  refersEntity: {
    type: Entity,
    args: {
      id: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const standOffPropertyId: string = filterXSS(args.id);
      return StandoffPropertyDAO.getEntity(standOffPropertyId);
    },
  },
  refersVariant: {
    type: Text,
    args: {
      id: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const standOffPropertyId: string = filterXSS(args.id);
      return StandoffPropertyDAO.getVariant(standOffPropertyId);
    },
  },
  comment: {
    type: Text,
    args: {
      id: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const standoffPropertyId: string = filterXSS(args.id);
      return StandoffPropertyDAO.getComment(standoffPropertyId);
    },
  },
  reference: {
    type: Text,
    args: {
      id: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const standoffPropertyId: string = filterXSS(args.id);
      return StandoffPropertyDAO.getReference(standoffPropertyId);
    },
  },
};
