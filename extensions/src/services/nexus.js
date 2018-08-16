
/**
 * Nexus client module
 *
 * @module  nexus
 */

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import trim from 'lodash/trim';
import last from 'lodash/last';
import first from 'lodash/first';
import get from 'lodash/get';
import set from 'lodash/set';

import http from './http';


const ID_ATTRIBUTE_INDEX = {
  uuid: 0,
  schemaVersion: 1,
  instanceType: 2,
  domain: 3,
  organization: 4,
};


/**
 * Returns object with prefix free properties
 *
 * @private
 *
 * @param {Object} src Source object to remove propertie profixes
 *
 * @returns {Object}
 *
 * @example
 * const entity = { '@id': 'idStr', 'nxv:deprecated': false };
 * const prefixFreeEntity = { id: 'idStr', deprecated: false }
 * assert.deepEqual(removePropPrefixes(entity), prefixFreeEntity);
 */
function removePropPrefixes(src) {
  if (isArray(src)) {
    return src.map(arrayVal => removePropPrefixes(arrayVal));
  }

  if (isObject(src)) {
    const prefixFreeObj = Object.keys(src).reduce((resObj, srcKey) => {
      const prefixFreeKey = last(srcKey.split(':')).replace(/@/, '');
      return Object.assign({ [prefixFreeKey]: removePropPrefixes(src[srcKey]) }, resObj);
    }, {});

    return prefixFreeObj;
  }

  return src;
}


/**
 * Returns a collection created by iterating on object with given path
 *
 * @private
 *
 * @param  {Object} sourceObj       Source object
 * @param  {String} iteratorPathStr Underscore-like path extended with `[]` substrings,
 *                                    e.g.: `results[].resultId`
 *
 * @return {Object[]}               Collection of target objects
 *
 * @example
 * const sourceObj = {
 *   results: [{
 *     id: 1,
 *     data: { content: 'content example1' },
 *   }, {
 *     id: 2,
 *     data: { content: 'content example2' },
 *   }]
 * }
 * const iterPath = 'results[].data'
 * const collection = mapByPath(sourceObj, iterPath);
 * const expectedcollection = [{ content: 'content example1' }, { content: 'content example2' }];
 * assert.deepEqual(collection, expectedCollection)
 *
 */
function mapByPath(sourceObj, iteratorPathStr) {
  const iteratorPaths = iteratorPathStr.split('[]');

  if (iteratorPaths.length === 1) return [sourceObj];

  const keyPath = first(iteratorPaths);
  const iteratee = get(sourceObj, trim(keyPath, '.'));

  return iteratee.reduce((acc, iter) => acc.concat(mapByPath(iter, iteratorPaths.slice(1).join('[]'))), []);
}

/**
 * Loads content of nexus entity with given id, it's linked entities and
 * returns normalized object according to provided configuration.
 *
 * @param {string} idUrl        Nexus entity id.
 * @param {Object} [normConf]   Normalization config, describes desired structure
 *                                for normalized entity to return. Each property
 *                                represents a lodash-like path to connected entityId.
 *
 * @param {Function} [changeCb] Will be called every time new part of nested entities
 *                                arrives, normalized entity with available data
 *                                will we passed as an argument.
 *
 * @returns {Promise}           Resolved with normalized entity object
 *                                once all nested data is loaded
 *
 * @example
 * const entityId = '<nexusEntityId>';
 * const normConf = {
 *   'outgoing.links': {
 *     'results[].resultId': {} // can be set to true if there is no nested properties
 *   },
 *   'target.id': {}
 * };
 * const entityNormalizedData = await fetchEntity(entityId, normConf);
 */
async function fetchEntity(idUrl, normConf = {}, changeCb = () => {}) {
  const { data: prefixedEntity } = await http.get(idUrl);
  const entity = removePropPrefixes(prefixedEntity);
  changeCb(entity);

  const nestedEntityFetches = [];

  if (!isObject(normConf)) return entity;

  Object.keys(normConf).forEach((path) => {
    const pathObjects = mapByPath(entity, path);
    pathObjects.forEach((targetObj) => {
      const localPath = trim(last(path.split('[]')), '.');
      const entityId = get(targetObj, localPath);

      if (!entityId) {
        console.warn(`Path ${localPath} can't be resolved`);
        return;
      }

      const nestedChangeCb = (nestedEntity) => {
        set(targetObj, `${localPath}Content`, nestedEntity);
        changeCb(entity);
      };
      const nestedEntityFetch = fetchEntity(entityId, normConf[path], nestedChangeCb);
      nestedEntityFetches.push(nestedEntityFetch);
    });
  });

  return Promise.all(nestedEntityFetches).then(() => entity);
}

/**
 * Return attribute for a given nexus instance id
 *
 * @param {*} id              Nexus instance id
 * @param {*} attributeIndex  Index of attribute to retreive.
 *                              See constant `ID_ATTRIBUTE_INDEX` for available options.
 *
 * @example
 * const id = '<nexusEntityId>'
 * const instanceType = nexus.getIdAttribute(nexusId, nexus.ID_ATTRIBUTE_INDEX.instanceType);
 * assert.equal(instanceType, 'morphology');
 */
function getIdAttribute(id, attributeIndex) {
  if (!id) throw new Error('No id has been provided');

  if (attributeIndex === undefined) {
    throw new Error('Attribute index is not defined');
  }

  return id.split('/').reverse()[attributeIndex];
}


export default {
  fetchEntity,
  getIdAttribute,
  ID_ATTRIBUTE_INDEX,
};
