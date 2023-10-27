import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { EntityQueries } from "./queries/Entity.queries";
import { SectionQueries } from "./queries/Section.queries";
import { MetadataQueries } from "./queries/Metadata.queries";
import { SearchQueries } from "./queries/Search.queries";
import { CommunicationQueries } from "./queries/Communication.queries";
import { ProjectTextQueries } from "./queries/ProjectText.queries";
import { TextQueries } from "./queries/Text.queries";
import { StandoffPropertyQueries } from "./queries/StandoffProperty.queries";

// Merging all queries with spread operator
const Queries: GraphQLObjectType = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...EntityQueries,
    ...SectionQueries,
    ...MetadataQueries,
    ...CommunicationQueries,
    ...TextQueries,
    ...SearchQueries,
    ...ProjectTextQueries,
    ...StandoffPropertyQueries,
  },
});

// Creating schema const for endpoint usage
export const schema: GraphQLSchema = new GraphQLSchema({
  query: Queries,
});
