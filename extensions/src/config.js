
const config = {
  auth: {
    clientId: 'bbp-entity-workbench',
    authUrl: 'https://bbpteam.epfl.ch/auth/realms/BBP/protocol/openid-connect/auth',
    request: { nonce: null },
  },
  externalApps: {
    tmdBaseUrl: 'http://morph-service.ocp.bbp.epfl.ch/tmd',
    blueNaasBaseUrl: 'https://blue-naas.humanbrainproject.eu/#/uuid',
    useCaseWizardBaseUrl: 'https://bbp.epfl.ch/public/dev.usecases-wizard/index.html#/entitydashboard',
  },

};

export default config;
