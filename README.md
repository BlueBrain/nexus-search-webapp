# nexus-search-webapp

## Elastic Search Proxy Dev Mode

make sure openshift CLI is installed

find the elastic search instance to connect to

```
oc port-forward ${ELASTIC_SEARCHCLIENT_NAME} ${SEARCH_PROXY_PORT}:${ELASTIC_SEARCH_POD_PORT}
```

Icon Credits
- flaticon user Freepik
- flaticon user  Dimitry Miroliubov