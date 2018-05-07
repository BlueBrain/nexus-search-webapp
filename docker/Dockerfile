FROM node:10-alpine

RUN apk add --no-cache tini

# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /usr/src/app
COPY index.js ./
COPY node_modules ./node_modules/

# Default values for environment variables
ENV NODE_ENV="production"
ENV ELASTICSEARCH_CLIENT_URL=""

CMD ["node","index.js"]

EXPOSE 8000
