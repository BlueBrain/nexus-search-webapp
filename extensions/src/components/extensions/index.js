
/**
 * Defines the interface between nexus-search-app and extensions
 */

import get from 'lodash/get';

import createExtension from '@/tools/component-wrapper';
import nexus from '@/services/nexus';
import http from '@/services/http';

import meModelComponents from './me-model';
import eModelComponents from './e-model';

const entityComponents = {
  meModel: meModelComponents,
  eModel: eModelComponents,
};


/**
 * Returns an array of extension classes for a particular entity type.
 *
 * @param {string} entityId - Nexus Entity Id
 *
 * @returns {Extension[]}
 */
function getByEntityId(entityId) {
  const entityType = nexus.getIdAttribute(entityId, nexus.ID_ATTRIBUTE_INDEX.instanceType);
  const extensionParams = { entityId };
  return get(entityComponents, entityType, [])
    .map(component => createExtension(component, extensionParams));
}

/**
 * List all the entitiy types which have according extensions
 *
 * @returns {string[]}
 */
function listAvailableEntityTypes() {
  return Object.keys(entityComponents);
}

/**
 *
 * Set the authorization so all the extensions can interact with protected data.
 *
 * @param {string} token - Bearer token (with Bearer string included)
 */
function setAuthToken(token) {
  http.setToken(token);
}

export default {
  getByEntityId,
  listAvailableEntityTypes,
  setAuthToken,
};
