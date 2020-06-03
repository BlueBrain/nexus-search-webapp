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

app.get('/embed', async (req: express.Request, res: express.Response) => {
  const options = {
    method: 'POST',
    url: 'http://dgx1.bbp.epfl.ch:32852/v1/embed/json',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'USE', text: 'A simple question' }),
  };
  const response = (await doRequest(options)) as any;
  const embedJSON = JSON.parse(response);
  const query = {
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
  console.log(query);
  const options2 = {
    method: 'POST',
    url:
      'http://elasticsearch.dev.nexus.ocp.bbp.epfl.ch/papers_use/_search?size=1',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  };
  try {
    const response2 = (await doRequest(options2)) as any;
    res.send(response2);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
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
