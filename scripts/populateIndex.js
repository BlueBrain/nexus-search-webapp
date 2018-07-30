import fs from "fs";
import path from "path";
import elasticsearch from "elasticsearch";
import config from "../server/libs/config";

const NEOBASE_DIR = process.env.NEOBASE_DIR;
const LIMIT = 1000;

const index = config.ELASTIC_SEARCH_INDEX;
const host = config.ELASTICSEARCH_CLIENT_URL;
const client = new elasticsearch.Client({ host });

const cellDir = path.resolve(NEOBASE_DIR, "./patchedcell");
const entityFileNames = fs.readdirSync(cellDir);

// from EPFL glossary https://bbp.epfl.ch/nmc-portal/glossary
const eTypeLabels = {
  cADpyr: "continuous Accommodating for pyramidal cells",
  cAC: "continuous Accommodating",
  bAC: "burst Accommodating",
  cNAC: "continuous Non-accommodating",
  bNAC: "burst Non-accommodating",
  dNAC: "delayed Non-accommodating",
  cSTUT: "continuous Stuttering",
  bSTUT: "burst Stuttering",
  dSTUT: "delayed Stuttering",
  cIR: "continuous Irregular",
  bIR: "burst Irregular"
};

const cells = entityFileNames.map(entityPath => {
  let entityData = require(path.resolve(cellDir, entityPath));
  return {
    "@id": entityData["@id"],
    "@type": "Cell",
    brainRegion: {
      "@id": entityData.brainLocation.brainRegion["@id"],
      label: entityData.brainLocation.brainRegion.label
    },
    cellName: {
      label: entityData.name
    },
    contributions: [],
    eType: {
      "@id": entityData.eType["@id"],
      label : eTypeLabels[entityData.eType.label],
      shortName: entityData.eType.label
    }
  };
});

let body = [];
for (let i=0; i <= cells.length -1; i++) {
  if (i+1 > LIMIT) { break; }
  let cell = cells[i];
  console.log(i, cell)
  body.push({ index: { _index: index, _type: "doc", _id:  cell["@id"]} })
  body.push(cell)
}

(async function() {
  const insert = await client.bulk({
    body
  });
  const { count } = await client.count({
    index: index
  });
  console.log("HOW MANY DOCS?: ", count);
})();
