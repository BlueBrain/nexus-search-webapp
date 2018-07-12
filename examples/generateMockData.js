import fs from "fs";
import path from "path";
const FILE_NAME = "mock.json";

const mockData = {
  "@type": "Cell",
  brainLocation: {
    brainRegion: {
      "@id": "http://api.brain-map.org/api/v2/data/Structure/218",
      label: "Lateral posterior nucleus of the thalamus"
    }
  },
  cellName: {
    label: "C270106A"
  },
  contributions: [
    {
      role: {
        "@id": "kjslfdhlaskhf",
        "label": "PI"
      },
      fullName: "Kenneth Pirman",
      affiliation: {
        "@id": "kjslfdhlaskhf",
        "label": "Blue Brain Project"
      }
    }
  ],
  eType: {
    "@id": "jsdflajsh",
    label: "continuous non-accomidating",
    shortName: "cNAC"
  },
  mType: {
    "@id": "asdfasf",
    label: "Layer 4 Large Basket",
    shortName: "L4-LBC"
  }
};

fs.writeFileSync(
  path.resolve(__dirname, `./${FILE_NAME}`),
  JSON.stringify(mockData, null, 2),
  "utf-8"
);
