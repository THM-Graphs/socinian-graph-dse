import express, { Express, Response } from "express";
import Neo4jDriver from "./database/Neo4jDriver";
import http, { Server } from "http";
import path from "path";
import Console from "./utils/Console";
import { schema } from "./graphql/_schema";
import { EnvironmentService } from "./utils/EnvironmentService";
import { graphqlHTTP } from "express-graphql";

Console.init(!process.argv.includes("--prod"));
console.debug("Debug Mode has been activated.");
new EnvironmentService(process.argv.includes("--prod"));
Neo4jDriver.createDatabaseConnection();

const application: Express = express();
const applicationPath: string = path.resolve(__dirname, "..", "..", "client", "dist", "pub-env");
const applicationPort: string = process.env.HTTPS_SERVER_PORT;

application.use("/graphql", graphqlHTTP({ schema, graphiql: !!process.env.GRAPHQL_IDE, pretty: true }));

const httpsServer: Server = http.createServer(application);
httpsServer.listen(applicationPort, () => {
  console.info("[Server]", `Server has been started on Port ${applicationPort}`);
  console.info("[Server]", `GraphiQL IDE: https://localhost:${applicationPort}/graphql`);
});

application.use("/", express.static(applicationPath));
application.get("*", (_, res: Response) => res.status(200).sendFile(`${applicationPath}/index.html`, { maxAge: "1y" }));
