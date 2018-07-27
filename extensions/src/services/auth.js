
import { JSO } from 'jso';

import config from '@/config';
import http from './http';


const client = new JSO({
  client_id: config.auth.clientId,
  redirect_uri: window.location.href,
  authorization: config.auth.authUrl,
  response_type: 'id_token token',
  request: config.auth.request,
});

function init() {
  client.callback();

  const authorization = client.getToken();
  authorization.then(session => http.setToken(`Bearer ${session.access_token}`));

  return authorization;
}

export default {
  init,
};
