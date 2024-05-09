import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from 'graphql';
import { filterXSS } from 'xss';
import ProjectDao from '../../database/Project.dao.js';
import { Project } from '../types/Project.js';
import { Nullable } from '../../types.js';
import { IBaseText } from '../../interfaces/IText.js';

export const ProjectQueries: GraphQLFieldConfigMap<string, string> = {
  project: {
    type: Project,
    args: { textId: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { textId: string }): Promise<Nullable<IBaseText>> => {
      const text: string = filterXSS(args.textId);
      return await ProjectDao.getProjectText(text);
    },
  },
};
