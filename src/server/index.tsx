import { resolve, join } from 'path';
import * as request from 'request';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as promBundle from 'express-prom-bundle';
import Helmet from 'react-helmet';
import html from './html';
import silentRefreshHtml from './silent_refresh';
import { RootState } from '../shared/store/reducers';
import { DEFAULT_UI_SETTINGS } from '../shared/store/reducers/ui-settings';

const PORT_NUMBER = 8000;

// Create a express app
const app: express.Express = express();
const rawBase: string = process.env.BASE_PATH || '';

// to develop plugins locally, change PLUGINS_PATH to '/public/plugins'
const pluginsManifestPath =
  process.env.PLUGINS_MANIFEST_PATH || '/public/plugins';

// remove trailing slash
const base: string = rawBase.replace(/\/$/, '');
// enable logs
app.use(morgan('dev'));
// expose status route
app.get(`${base}/status`, (req, res) => res.send('OK'));
// Prometheus
app.use(promBundle({ includeMethod: true, metricsPath: `${base}/metrics` }));
// parse cookies
app.use(cookieParser());
// server static assets from the /public directory
app.use(`${base}/public`, express.static(join(__dirname, 'public')));

// if in Dev mode, setup HMR and all the fancy stuff
if (process.env.NODE_ENV !== 'production') {
  const { setupDevEnvironment } = require('./dev');
  setupDevEnvironment(app);
}

// silent refresh
app.get(
  `${base}/silent_refresh`,
  (req: express.Request, res: express.Response) => {
    res.send(silentRefreshHtml());
  }
);
// For literature search
app.get('/litsearch', async (req: express.Request, res: express.Response) => {
  const embedJSON = await getEmbedding(req);
  const size = req.query['size'] || '5';
  const start = req.query['start'] || '0';
  const ESResult = await getESResult(embedJSON, size, start);
  res.send(ESResult);
});
// For all routes
app.get('*', async (req: express.Request, res: express.Response) => {
  // Compute pre-loaded state
  const preloadedState: RootState = {
    auth: {},
    config: {
      pluginsManifestPath,
      apiEndpoint: process.env.API_ENDPOINT || '/',
      basePath: base,
      clientId: process.env.CLIENT_ID || 'nexus-web',
      redirectHostName: `${process.env.HOST_NAME ||
        `${req.protocol}://${req.headers.host}`}${base}`,
      sentryDsn: process.env.SENTRY_DSN,
      gtmCode: process.env.GTM_CODE,
      studioView: process.env.STUDIO_VIEW || '',
    },
    uiSettings: DEFAULT_UI_SETTINGS,
    oidc: {
      user: undefined,
      isLoadingUser: false,
    },
  };

  // render an HTML string of our app
  const body: string = '';

  // Compute header data
  const helmet = Helmet.renderStatic();
  res.send(html({ body, helmet, preloadedState }));
});

app.listen(PORT_NUMBER, () => {
  // tslint:disable-next-line:no-console
  console.log(`Nexus Web is listening on a port ${PORT_NUMBER} ...`);
});

export default app;

async function getESResult(embedJSON: any, size: string, start: string) {
  const query = {
    size,
    from: start,
    query: {
      nested: {
        path: 'sentences',
        query: {
          function_score: {
            script_score: {
              script: {
                source:
                  "cosineSimilarity(params.query_embedding, doc['sentences.embedding']) + 1.0",
                params: { query_embedding: embedJSON['embedding'] },
              },
            },
          },
        },
        inner_hits: { size: 1, _source: { excludes: ['sentences.embedding'] } },
        score_mode: 'max',
      },
    },
    _source: {
      includes: [
        'author',
        'datePublished',
        'title',
        'sameAs',
        'license',
        'abstract',
        'articleBody',
      ],
    },
  };
  const ESUrl = `http://elasticsearch.dev.nexus.ocp.bbp.epfl.ch/papers_use/_search?size=${size}`;
  const options = postOptionObject(ESUrl, query);
  const response = (await doRequest(options)) as any;
  return response;
}

async function getEmbedding(req: express.Request) {
  const searchText = req.query['search'];
  const model = req.query['model'] || 'USE';
  const embedQuery = { model, text: searchText };
  const embedUrl = 'http://dgx1.bbp.epfl.ch:32852/v1/embed/json';
  const options = postOptionObject(embedUrl, embedQuery);
  const response = (await doRequest(options)) as any;
  const embedJSON = JSON.parse(response);
  return embedJSON;
}

function doRequest(options: any) {
  return new Promise((resolve, reject) => {
    request(options, (error: any, res: any, body: any) => {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}

function postOptionObject(url: string, bodyObject: any) {
  return {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyObject),
  };
}
