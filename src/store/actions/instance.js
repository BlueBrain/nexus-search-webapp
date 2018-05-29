import { fetchWithToken } from '@bbp/nexus-js-helpers';
import * as types from './types';
import qs from "query-string";

export default {
  fetchInstance,
  fetchInstanceStarted,
  fetchInstanceFulfilled,
  fetchInstanceFailed,
}

function fetchInstance () {
  return (dispatch, getState) => {
    let { auth, routing } = getState();
    const { token } = auth
    const instanceID = qs.parse(routing.location.search).instance;
    if (!instanceID) { return; }
    dispatch(fetchInstanceStarted())
    return fetchWithToken(instanceID, token)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Encountered HTTP error ${response.status}. Instance info is not available.`);
    })
    .then(instance => {
      if (instance === undefined) {
        throw new Error('Instance is not defined');
      }
      dispatch(fetchInstanceFulfilled(instance))
      return fetchIncomingOutgoing(instance.links, token);
    })
    .then(([incoming, outgoing]) => {
      dispatch(instanceLinksAdded({ incoming: incoming.results, outgoing: outgoing.results }));
    })
    .catch(error => {
      console.error(error);
      dispatch(fetchInstanceFailed(error))
    });
  }
}

function fetchIncomingOutgoing(links, access_token) {
  const requestOptions = access_token? { headers: { "Authorization": "Bearer "+ access_token } }: {};
  return Promise.all([
    fetch(links['incoming'] + '?fields=all', requestOptions),
    fetch(links['outgoing'] + '?fields=all', requestOptions),
  ])
  .then(responses => Promise.all([
      responses[0].json(),
      responses[1].json()
    ])
  )
}

function fetchInstanceStarted () {
  return {
    type: types.FETCH_INSTANCE_STARTED,
  }
}

function fetchInstanceFulfilled(data) {
  return {
    type: types.FETCH_INSTANCE_FULFILLED,
    payload: data
  }
}

function fetchInstanceFailed (error) {
  return {
    type: types.FETCH_INSTANCE_FAILED,
    error: error
  }
}

function instanceLinksAdded(data) {
  return {
    type: types.INSTANCE_LINKS_ADDED,
    payload: data
  }
}