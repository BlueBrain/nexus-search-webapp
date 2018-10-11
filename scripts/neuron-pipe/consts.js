// project base url (for IDs)
export const base = "http://created.by.kenny/";

// context name (expanded)
export const context = base + "neuroshapes";

// Which types do we save inside Nexus V1
export const types = {
  searchCell: {
    "@id": "nxv:SearchCell"
  },
  searchIonChannel: {
    "@id": "nxv:SearchIonChannel"
  },
  searchIonChannelCell: {
    "@id": "nxv:SearchIonChannelCell"
  }
};

// Which resources do we consume from Nexus v1
// to create our tranformed instances
const resourceDict = {
  pc: {
    url: "https://bbp.epfl.ch/nexus/v0/data/bbp/experiment/patchedcell/v0.1.0/",
    context:
      "https://bbp.epfl.ch/nexus/v0/contexts/neurosciencegraph/core/data/v1.0.1",
    name: "somatosensory patched cells",
    repository: "Neocortical Microcircuitry Collaboration Portal",
    source: "NMC portal",
    studyType: "Experimental",
    type: types.searchCell["@id"]
  },
  tpc: {
    url:
      "https://bbp.epfl.ch/nexus/v0/data/thalamusproject/experiment/patchedcell/v0.1.0/",
    context:
      "https://bbp.epfl.ch/nexus/v0/contexts/neurosciencegraph/core/data/v1.0.1",
    name: "Thalamus project patched cells",
    source: "Thalamus project",
    repository: null,
    short: "tpc",
    studyType: "Experimental",
    type: types.searchCell["@id"]
  },
  em: {
    url:
      "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/emodel/v0.1.1/",
    context:
      "https://bbp-nexus.epfl.ch/staging/v0/contexts/neurosciencegraph/core/data/v1.0.2",
    name: "Cell Models (eModels)",
    type: types.searchCell["@id"],
    source: "BBP",
    studyType: "In Silico",
    repository: null
  },
  subcell: {
    url:
      "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/subcellularmodel/v0.1.2/",
    name: "Subcellular Mechanisms",
    context: "https://bbp-nexus.epfl.ch/staging/v0/contexts/neurosciencegraph/core/data/v1.0.2",
    type: types.searchIonChannel["@id"],
    source: "BBP",
    studyType: "In Silico",
    repository: null
  },
  rwbc: {
    url: "https://bbp.epfl.ch/nexus/v0/data/neocortexproject/morphology/reconstructedwholebraincell/v0.1.1/",
    context:
      "https://bbp.epfl.ch/nexus/v0/contexts/neurosciencegraph/core/data/v0.1.0",
    name: "Reconstructed Whole Brain Cells",
    repository: "MouseLight",
    source: "Neocortex Project",
    studyType: "Experimental",
    type: types.searchCell["@id"]
  },
  wmurwbc: {
    url: "https://bbp.epfl.ch/nexus/v0/data/bbp/morphology/reconstructedwholebraincell/v0.1.1/",
    context:
    "https://bbp.epfl.ch/nexus/v0/contexts/neurosciencegraph/core/data/v1.0.1",
    name: "WMU Reconstructed Whole Brain Cells",
    repository: null,
    source: "WMU",
    studyType: "Experimental",
    type: types.searchCell["@id"]
  },
  rpc: {
    url: "https://bbp.epfl.ch/nexus/v0/data/neocortexproject/morphology/reconstructedpatchedcell/v0.1.1/",
    context: "https://bbp.epfl.ch/nexus/v0/contexts/neurosciencegraph/core/data/v0.2.0",
    name: "Reconstructed Patch Cell",
    repository: null,
    source: "Neocortex Project",
    studyType: "Experimental",
    type: types.searchCell["@id"]
  },
  uploaded: {
    url: "http://uploader.bbp.epfl.ch/",
    name: "Uploaded Resources",
    source: "Nexus File Uploader"
  },
  emtc: {
    url: "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/emodeltraceset/v0.0.1/",
    name: "E Model Trace Collection",
    source: "BBP NSE"
  },
  pctc: {
    url: "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/electrophysiology/experimentaltraceset/v0.0.1?filter=%7B%22op%22%3A%22eq%22%2C%22path%22%3A%22rdf%3Atype%22%2C%22value%22%3A%22nsg%3AConfiguration%22%7D&context=%7B%22nsg%22%3A%20%22https%3A%2F%2Fbbp-nexus.epfl.ch%2Fvocabs%2Fbbp%2Fneurosciencegraph%2Fcore%2Fv0.1.0%2F%22%7D",
    name: "Exp Cell Trace Collection",
    source: "BBP NSE"
  },
  icc: {
    url:
      "https://bbp.epfl.ch/nexus/explorer/ionchannelproject/experiment/cell/v0.1.0/",
    name: "Ion Channel Experiment",
    context: "https://bbp.epfl.ch/nexus/v0/contexts/neurosciencegraph/core/data/v1.0.4",
    type: types.searchIonChannel["@id"],
    source: "BBP",
    studyType: "Experimental",
    repository: "Channelpedia"
  }
};

// expose resourceDict as "resources" with additional field "short"
// which will always be the same as the key
export const resources = Object.keys(resourceDict).reduce((memo, key) => {
  memo[key] = Object.assign(resourceDict[key], { short: key });
  return memo;
}, {});
