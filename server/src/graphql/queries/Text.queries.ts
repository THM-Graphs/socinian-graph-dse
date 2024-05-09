import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import TextDAO from '../../database/Text.dao';
import { Text } from '../types/Text';
import { Nullable } from '../../types.js';
import { IText } from '../../interfaces/IText.js';

export const TextQueries: GraphQLFieldConfigMap<string, string> = {
  text: {
    type: Text,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<IText>> => {
      const textId: string = filterXSS(args.id);
      return await TextDAO.getText(textId);
    },
  },
};
