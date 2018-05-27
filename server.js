// import proxy from 'express-http-proxy';
import express from 'express';
import dotenv from 'dotenv';
import elasticsearch from "elasticsearch";
import routes from "./routes";
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

// import OCPPortForwarding from './ocp-port-forwarding';

const STAGE = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

// load ENV variables from env stage configs
dotenv.config({path: `./envs/${STAGE}.env`});

// start port forwarding to OCP
// only necessary if going to ocp instance, not local
// OCPPortForwarding();

const app = express();
var cors = require('cors')
app.use(cors())

routes(app, client);
// app.use('/', proxy(process.env.ELASTICSEARCH_CLIENT_URL));

const server = app.listen(process.env.SEARCH_PROXY_PORT, () => {
  console.log('Search Proxy Service running on port: ', server.address().port)
});