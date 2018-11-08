FROM nginx:stable-alpine

# Put our build artifact and custom conf in the right places
RUN chgrp -R 0 /var/cache/nginx && chmod g+wx /var/cache/nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log
RUN touch /var/run/nginx.pid && chgrp 0 /var/run/nginx.pid && chmod g+rwx /var/run/nginx.pid

# Prepare nginx configuration for environment substitution at runtime
WORKDIR /etc/nginx
COPY docker/client/nginx.conf ./
RUN chgrp 0 nginx.conf && chmod g+w nginx.conf
RUN cp -a nginx.conf nginx.conf.template

# Put app files in the right place
WORKDIR /usr/share/nginx/html
COPY dist-client .

# Prepare application files for environment substitution at runtime
RUN chgrp 0 index.html && chmod g+w index.html
RUN cp -a index.html index.html.template

# Default values for environment variables
ENV BASE_PATH="/search"
ENV BASE_URI="https://bbp-nexus.epfl.ch/staging"
ENV SEARCH_API_URI="https://bbp-nexus.epfl.ch/staging/search-api"

CMD ["/bin/sh","-c","envsubst '$BASE_PATH' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf \
    && envsubst '$APP_NAME,$SEARCH_API_URI,$BASE_URI,$BASE_PATH' < index.html.template > index.html \
    && nginx -g 'daemon off;'"]

EXPOSE 8000
