
/**
 * Defines the interface between nexus-search-app and extensions
 */

import createExtension from '@/tools/component-wrapper';
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
 * @param {string} type - Nexus Entity Type
 *
 * @returns {Extension[]}
 */
function getByEntityType(type) {
  return entityComponents[type].map(component => createExtension(component));
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
  getByEntityType,
  listAvailableEntityTypes,
  setAuthToken,
};
