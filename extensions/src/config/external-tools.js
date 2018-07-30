
/**
 * Manage the tools that you can run for specific entity type
 */

import find from 'lodash/find';

import { getTypeById, generateNotebookParamsObject, getIdByUrl } from '@/tools/utils';

const tmdLink = 'http://morph-service.ocp.bbp.epfl.ch/tmd';
const blueNaasBase = 'https://blue-naas.humanbrainproject.eu/#/uuid';
const useCaseWizardBase = 'https://bbp.epfl.ch/public/dev.usecases-wizard/index.html#/entitydashboard';

function generateBlueNaasFullLink(entityId) {
  const uuid = getIdByUrl(entityId);
  return `${blueNaasBase}/${uuid}`;
}

function generateNotebookFullLink(entityId) {
  const uuid = getIdByUrl(entityId);
  const queryParams = generateNotebookParamsObject(uuid);
  return useCaseWizardBase + queryParams;
}

/**
 * List of all the actions that we have available
 */
const toolsCatalog = {
  blueNaas: entityId => ({
    name: 'Neuron as a service', icon: 'fa-play', link: generateBlueNaasFullLink(entityId),
  }),
  analysisNotebook: entityId => ({
    name: 'Analysis in Jupyter Notebook', icon: 'fa-edit', link: generateNotebookFullLink(entityId),
  }),
  tmd: () => ({
    name: 'Topological Morphology Descriptor', icon: 'fa-edit', link: tmdLink,
  }),
};

/**
 * Tools availbale for a specific entity type
 */
const toolsByType = {
  meModel: ['blueNaas', 'tmd', 'analysisNotebook'],
  morphology: ['tmd', 'analysisNotebook'],
};

function getByEntityId(entityId) {
  const entityType = getTypeById(entityId);
  const tools = find(toolsByType, (value, key) => key.toLowerCase() === entityType);
  if (!tools) return [];
  const toolsForEntity = tools.map(tool => toolsCatalog[tool](entityId));
  return toolsForEntity;
}

export default {
  getByEntityId,
};
