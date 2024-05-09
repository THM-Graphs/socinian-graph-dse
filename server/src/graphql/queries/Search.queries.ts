import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import { SearchResult } from '../types/Search';
import { ISearch } from '../../interfaces/ISearch.js';

export const SearchQueries: GraphQLFieldConfigMap<string, string> = {
  search: {
    type: SearchResult,
    args: { phrase: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { phrase: string }): Promise<Partial<ISearch>> => {
      const phrase: string = filterXSS(args.phrase);
      if (phrase.length < 3) return {};
      return { phrase };
    },
  },
};
