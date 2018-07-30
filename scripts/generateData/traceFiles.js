
import { sample } from "underscore";
import path from "path";
import fs from "fs";

const NEOBASE_DIR = process.env.NEOBASE_DIR;

const ephysDir = path.resolve(NEOBASE_DIR);

const tracesDir = `${ephysDir}/trace`;

if (!fs.existsSync(tracesDir)) {
  throw new Error(`tracesDir does not exist at path ${tracesDir}`)
}


const tracesFiles = fs.readdirSync(tracesDir);

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

const CONTRIBUTIONS = [
  {
    role: {
      "@id": "kjslfdhlaskhf",
      label: "Principal Investigator",
      shortName: "PI"
    },
    fullName: "Maria Toledo",
    affiliation: {
      "@id": "kjslfdhlaskhf",
      label: "Blue Brain Project"
    }
  },
  {
    role: {
      "@id": "kjslfdhlaskhf",
      label: "Lab Technician",
      shortName: "tech"
    },
    fullName: "Ying Shi",
    affiliation: {
      "@id": "kjslfdhlaskhf",
      label: "Blue Brain Project"
    }
  },
  {
    role: {
      "@id": "274987124",
      label: "Lab Technician",
      shortName: "tech"
    },
    fullName: "Brian Ruiz",
    affiliation: {
      "@id": "kjslfdhlaskhf",
      label: "Blue Brain Project"
    }
  },
  {
    role: {
      "@id": "274987124",
      label: "Lab Technician",
      shortName: "tech"
    },
    fullName: "Brittany Baker",
    affiliation: {
      "@id": "kjslfdhlaskhf",
      label: "Blue Brain Project"
    }
  }
];

function extractCellName (label) {
  const cellNameMatch = label.match(/[a-z]*([A-Z0-9]*).*/);
  return cellNameMatch[1].substring(0, cellNameMatch[1].length - 2);
};

export default () => {
  try {
    let documents = {};
    tracesFiles.forEach(async traceFile => {
      const data = require(`${tracesDir}/${traceFile}`);
      const stimulusExperimentId = data["wasGeneratedBy"]["@id"];
      const stimulusExperimentData = require(`${ephysDir}/stimulusexperiment/${stimulusExperimentId}.json`);
      const patchedCell = require(`${ephysDir}/patchedcell/${
        stimulusExperimentData["used"]["@id"]
      }`);
      const subject = require(`${ephysDir}/subject/${
        patchedCell["wasDerivedFrom"]["@id"]
      }`);
      const cellName = extractCellName(patchedCell.name);
      if (!documents[cellName]) {
        documents[cellName] = {
          "@id": patchedCell["@id"],
          "@type": "Cell",
          brainRegion: patchedCell.brainLocation
            ? patchedCell.brainLocation.brainRegion
            : "",
          cellName: {
            label: cellName
          },
          patchedCell: {
            "@id": patchedCell["@id"],
            label: patchedCell.name
          },
          contributions: sample(
            CONTRIBUTIONS,
            Math.ceil(Math.random() * CONTRIBUTIONS.length)
          ),
          eType: {
            "@id": patchedCell.eType["@id"],
            label: eTypeLabels[patchedCell.eType.label],
            shortName: patchedCell.eType.label
          },
          subject: {
            "@id": subject["@id"],
            age: subject.age,
            name: subject.name,
            providerId: subject.providerId,
            sex: subject.sex,
            species: subject.species,
            strain: subject.strain
          },
          distribution: {
            mediaType: "application/zip",
            // file: name,
            url: `https://bbpteam.epfl.ch/public/nmc-portal-data-O1.v6/experimental-electrophysiology-downloads/${
              patchedCell.name
            }.zip`
          },
          traces: []
        };
      }

      const imageBase = data["name"]
        .slice(0, data.name.lastIndexOf("."))
        .split("/");

      const metadata = {
        id: data["@id"],
        channel: data["channel"],
        fileName: data["name"],
        previewImage: {
          full: {
            url: `https://bbpteam.epfl.ch/public/nmc-portal-data-O1.v6/experimental-electrophysiology-plots/${
              imageBase[0]
            }/optimized/${imageBase[1]}.png`
          },
          thumbnail: {
            url: `https://bbpteam.epfl.ch/public/nmc-portal-data-O1.v6/experimental-electrophysiology-plots/${
              imageBase[0]
            }/thumbnails/${imageBase[1]}.png`
          }
        },
        stimulus: stimulusExperimentData.stimulus.stimulusType
      };
      documents[cellName]["traces"].push(metadata);
      console.log(`Processed trace ${data.name} for cell ${cellName}.`);
    });
    console.log(`Processed ${Object.keys(documents).length} cell documents`);
    return documents;
  } catch(error) {
    console.log(error);
    console.log("error occured in traceFiles");
  }
}
