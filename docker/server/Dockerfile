FROM node:10-alpine

RUN apk add --no-cache tini

# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /usr/src/app/
COPY dist/server ./
COPY node_modules ./node_modules

# Default values for environment variables
ENV NODE_ENV="production"
ENV ELASTIC_SEARCH_INDEX="index"
ENV SEARCH_PROXY_PORT="8000"
ENV ELASTICSEARCH_CLIENT_URL="http://elasticsearch.bbp-nexus-dev.svc.cluster.local:9200"
ENV SEARCH_API_BASE_PATH="/staging/search-api"

CMD ["node","index.js"]

EXPOSE 8000
