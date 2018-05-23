import proxy from 'express-http-proxy';
import express from 'express';
import dotenv from 'dotenv';
import OCPPortForwarding from './ocp-port-forwarding';

const STAGE = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

// load ENV variables from env stage configs
dotenv.config({path: `./envs/${STAGE}.env`});

// start port forwarding to OCP
OCPPortForwarding();

const app = express();

app.use('/', proxy(process.env.ELASTICSEARCH_CLIENT_URL));

const server = app.listen(process.env.SEARCH_PROXY_PORT, () => {
  console.log('Search Proxy Service running on port: ', server.address().port)
});