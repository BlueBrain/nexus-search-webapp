FROM node:10-alpine

RUN apk add --no-cache tini

# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /usr/src/app/
COPY dist-server ./

# Default values for environment variables
ENV NODE_ENV="production"
ENV ELASTIC_SEARCH_INDEX="search_view"
ENV SEARCH_PROXY_PORT="8000"
ENV ELASTICSEARCH_CLIENT_URL="https://bbp.epfl.ch/nexus/v1/views/webapps/search/"
ENV SEARCH_API_BASE_PATH=""
ENV STATIC_DATA_FOLDER="/usr/share/nginx/html/data"
ENV RESOURCE_URL="https://bbp.epfl.ch/nexus/v1/resources/webapps/search/resources/"
ENV SEARCH_APP_SERVICE_TOKEN_PROD="super-secret-token"
ENV SEARCH_APP_SERVICE_TOKEN_STAG="super-secret-token"
ENV KAFKA_HOST="localhost:9092"
ENV KAFKA_TOPIC="my-search-topic"

RUN npm i --production

CMD ["node","index.js"]

EXPOSE 8000
