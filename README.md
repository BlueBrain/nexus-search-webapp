# nexus-search-webapp

> Search and filter nexus data via elastic search

This is a webapp and server that queries an elastic search index of Nexus to filter and search data in a way more useful to some users than using the Knowledge Graph.

## Development

The server uses a [dotenv file](https://www.npmjs.com/package/dotenv) for configuration.

Copy `envs\dev.env.example` and rename to `envs\dev.env`. Change the ENV vars as needed. They will be injected to the app at launch, as long as `NODE_ENV=development` . Importantly, make sure the Elastic Search variables are configured, or the server will just deliver errors.

Configure the Client using the ENV vars visible in the client-side index file under `public/index.html`. The dotenv file for the server does not work for this yet, you must export the ENV vars manually.

to launch the client and server in tandem:
``` npm run dev ```

## Produciton

You can build the docker files from the project.json npm scripts.
``` npm run build-docker:server ```
``` npm run build-docker:client ```

make sure to edit the docker files under the `docker` folder to configure the previously-mentioned ENV vars, so that the service and client will speak to eachother.

