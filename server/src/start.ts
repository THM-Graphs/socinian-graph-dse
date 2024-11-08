import express, { Express, Request, Response } from 'express';
import Neo4jDriver from './utils/Neo4jDriver.js';
import http, { Server } from 'http';
import path from 'path';
import Logger from './utils/Logger.js';
import { schema } from './graphql/_schema';
import { createHandler } from 'graphql-http/lib/use/http';
import dotenv from 'dotenv';
import { ExpressUtils } from './utils/ExpressUtils.js';

dotenv.config();
const ROOT_PATH: string = path.resolve(__dirname, '..', '..');
const APPLICATION_PATH: string = path.resolve(ROOT_PATH, 'client', 'dist', 'pub-env');
const APPLICATION_PORT: string = process.env.HTTPS_SERVER_PORT ?? '8443';
const GRAPHIQL_PATH: string = path.resolve(__dirname, '..', 'graphiql', 'index.html');
const MARKDOWN_PATH: string = path.resolve(__dirname, '..', 'markdown');

Logger.init(process.argv.includes('--debug'));
console.debug('Debug Mode has been activated.');

const application: Express = express();
Neo4jDriver.createDatabaseConnection();

const httpsServer: Server = http.createServer(application);
httpsServer.listen(APPLICATION_PORT, () => {
  console.info('[Server]', `BACKEND SERVER RUNNING ON: ${APPLICATION_PORT}`);
  console.info('[Server]', `GRAPHQL PLAYGROUND: http://localhost:${APPLICATION_PORT}/editor`);
});

application.use(ExpressUtils.decodeMiddleware);
application.use('/graphql', createHandler({ schema }));

application.use('/markdown', express.static(MARKDOWN_PATH));
application.use('/', express.static(APPLICATION_PATH));

application.get('/editor', (_: Request, res: Response) => res.sendFile(GRAPHIQL_PATH));
application.get('*', (_: Request, res: Response) =>
  res.status(200).sendFile(`${APPLICATION_PATH}/index.html`, { maxAge: '1y' }),
);
