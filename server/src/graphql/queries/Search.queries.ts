import { GraphQLFieldConfigMap, GraphQLString, GraphQLNonNull } from "graphql";
import { filterXSS } from "xss";
import { SearchResult } from "../types/Search";

export const SearchQueries: GraphQLFieldConfigMap<string, string> = {
  search: {
    type: SearchResult,
    args: {
      phrase: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { phrase: string }) => {
      const phrase: string = filterXSS(args.phrase);
      if (phrase.length < 3) return;
      return { phrase };
    },
  },
};
