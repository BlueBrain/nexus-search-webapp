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

## Getting involved

Issue tracking is centralized into [the main Blue Brain Nexus repository](https://github.com/BlueBrain/nexus).

There are several channels provided to address different issues:
- **Feature request**: If there is a feature you would like to see in this application, please first consult the [list of open feature requests](https://github.com/BlueBrain/nexus/issues?q=is%3Aopen+is%3Aissue+label%3Afeature+label%3Afrontend+label%3Asearch). In case there isn't already one, please [open a feature request](https://github.com/BlueBrain/nexus/issues/new?labels=feature,frontend,search) describing your feature with as much detail as possible.
- **Bug report**: If you have found a bug, please create an issue [here](https://github.com/BlueBrain/nexus/issues/new?labels=bug,frontend,search).

