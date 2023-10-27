import { GraphQLFieldConfigMap, GraphQLString, GraphQLNonNull } from "graphql";
import { filterXSS } from "xss";
import ProjectTextDao from "../../database/ProjectText.dao";
import { ProjectText } from "../types/ProjectText";

export const ProjectTextQueries: GraphQLFieldConfigMap<string, string> = {
  projectText: {
    type: ProjectText,
    args: {
      id: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: { id: string }) => {
      const projectTextId: string = filterXSS(args.id);
      return await ProjectTextDao.getProjectText(projectTextId);
    },
  },
};
