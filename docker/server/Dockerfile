FROM node:10-alpine

RUN apk add --no-cache tini

# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /usr/src/app/
COPY dist/server ./

# Default values for environment variables
ENV NODE_ENV="production"
ENV ELASTIC_SEARCH_INDEX="index"
ENV SEARCH_PROXY_PORT="8000"
ENV ELASTICSEARCH_CLIENT_URL="http://localhost:9200"

CMD ["node","index.js"]

EXPOSE 8000
