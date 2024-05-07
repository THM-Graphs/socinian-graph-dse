import express, { Express, Response } from 'express';
import Neo4jDriver from './database/Neo4jDriver';
import http, { Server } from 'http';
import path from 'path';
import Console from './utils/Console';
import { schema } from './graphql/_schema';
import { createHandler } from 'graphql-http/lib/use/http';
import * as dotenv from 'dotenv';
import graphqlPlayground from 'graphql-playground-middleware-express';

dotenv.config();

Console.init(!process.argv.includes('--debug'));
console.debug('Debug Mode has been activated.');
Neo4jDriver.createDatabaseConnection();

const rootPath: string = path.resolve(__dirname, '..', '..');
const applicationPath: string = path.resolve(rootPath, 'client', 'dist', 'pub-env');
const applicationPort: string = process.env.HTTPS_SERVER_PORT;

const application: Express = express();
const httpsServer: Server = http.createServer(application);
httpsServer.listen(applicationPort, () => {
  console.info('[Server]', `Server has been started on Port ${applicationPort}`);
  console.info('[Server]', `GraphiQL IDE: https://localhost:${applicationPort}/playground`);
});

application.use('/graphql', createHandler({ schema }));
application.get('/playground', graphqlPlayground({ endpoint: '/graphql' }));

application.use('/', express.static(applicationPath));
application.get('*', (_, res: Response) => res.status(200).sendFile(`${applicationPath}/index.html`, { maxAge: '1y' }));
