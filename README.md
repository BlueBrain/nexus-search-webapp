# nexus-search-webapp

> Search and filter nexus data via elastic search

This is a webapp and server that queries an elastic search index of Nexus to filter and search data in a way more useful to some users than using the Knowledge Graph.

## Development

The server uses a [dotenv file](https://www.npmjs.com/package/dotenv) for configuration.

Copy `envs\dev.env.example` and rename to `envs\dev.env`. Change the ENV vars as needed. They will be injected to the app at launch, as long as `NODE_ENV=development` . Importantly, make sure the Elastic Search variables are configured, or the server will just deliver errors.

The client-side `index.html` document will be transpiled with the ENV vars in the dotenv file as well. Make sure the BASE_URI is configured, which will be used to create the log-in and api urls. You can see how these urls are built by following the code under `src/store/reducers/config.js`.

to launch the client and server in tandem:
``` npm run dev ```

## Production

You can build the docker files from the project.json npm scripts.
``` npm run build-docker:server ```
``` npm run build-docker:client ```

make sure to edit the docker files under the `docker` folder to configure the previously-mentioned ENV vars, so that the service and client will speak to each other.

