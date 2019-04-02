# BBP Nexus Search

> The searchable neuroscience knowledgegraph

BBP Nexus Search Is a web application that allows for looking at BBP's datasets that are stored in our nexus instance in a way that's more useful than, for example, Nexus Web's more generic interface.

It provides useful filters based on MINDS properties common to all integrated neuroscience datasets.

## How does data get into this Search App?

Once data is integrated into Nexus (under the `bbp` organization), the data will be automatically available in this search application. As the dataset conforms more and more to _MINDS_, filters will work automatically for that dataset as well.

## How does querying work?

Instead of the previous iteration, which uses it's own bespoke elastic search instance, this version queries Nexus using _SPARQL_ directly from the client.

There is no server-side data ETL or scripts to run to get the right queries. The server for BBP Nexus Search exists only for server-side rendering html content for SEO and sharing purposes.

## Development

Install dependencies:

```sh
npm i
```

To start the Nexus in development mode, run:

```sh
npm run start
```

Lint code:

```sh
npm run lint
```

Run unit tests:

```sh
npm test
```

## Build for production

Compile app in `dist/` folder.

```sh
npm run build
```

You can run the app with:

```sh
node dist/server.js
```

## Build a Docker image

```sh
docker build . --tag=nexus-web
```

## ENV variables list

- `BASE_PATH`: The base of the app: i.e. `/staging/web` if hosted on `https://bbp-nexus.epfl.ch/staging/web` (default is `/`)
- `HOST_NAME`: name of host where application is available from: i.e. `https://bbp-nexus.epfl.ch` (default is protocol + host where server is running from)
- `CLIENT_ID`: The application name used for _OpenID Connect_ authentication (default is `nexus-web`)
- `API_ENDPOINT`: The URL pointing to Nexus API. Default is '/'
- `SECURE`: Is nexus web running in https or not. Default is `false`

## Getting involved

Issue tracking is centralized into [the main Blue Brain Nexus repository](https://github.com/BlueBrain/nexus).

There are several channels provided to address different issues:

- **Feature request**: If there is a feature you would like to see in this application, please first consult the [list of open feature requests](https://github.com/BlueBrain/nexus/issues?q=is%3Aopen+is%3Aissue+label%3Afeature+label%3Afrontend+label%3Anexus-web). In case there isn't already one, please [open a feature request](https://github.com/BlueBrain/nexus/issues/new?labels=feature,frontend,nexus-web) describing your feature with as much detail as possible.
- **Bug report**: If you have found a bug, please create an issue [here](https://github.com/BlueBrain/nexus/issues/new?labels=bug,frontend,nexus-web).
