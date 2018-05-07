const proxy = require('express-http-proxy');
const app = require('express')();

app.use('/', proxy(process.env.ELASTICSEARCH_CLIENT_URL));

app.listen(8000);
