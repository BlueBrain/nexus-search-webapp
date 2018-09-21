const glossary = {
  TPC: "Tufted Pyramidal Cell, late bifurcating",
  "Type 2 Parvalbumin (PV)-positive basket interneuron":
    "Type 2 Parvalbumin (PV)-Positive Basket Interneuron",
  "Martinotti interneuron": "Martinotti Cell",
  "Somatostatin (SOM)-positive Martinotti interneuron": "Martinotti Cell",
  "basket interneuron": "Basket Cell",
  "pyramidal principal cell": "Pyramidal Cell",
  "neurogliaform interneuron": "Neurogliaform Cell",
  "bipolar interneuron": "Bipolar Cell",
  "bitufted interneuron": "Bitufted Cell",
  "Neocortex pyramidal cell": "Pyramidal Cell",
  UPC: "Untufted Pyramidal Cell",
  "Parvalbumin (PV)-positive basket interneuron":
    "Parvalbumin (PV)-Positive Basket Interneuron",
  "shrub cell interneuron": "Shrub Cell Interneuron",
  "horizontally elongated interneuron": "Horizontally Elongated Interneuron",
  "deep projecting interneuron": "Deep Projecting Interneuron",
  "single bouquet interneuron": "Single Bouquet Cell",
  "neurogliaform elongated interneuron": "Neurogliaform Elongated Cell",
  "Chandelier interneuron": "Chandelier Cell",
  "double bouquet interneuron": "Double Bouquet Cell",
  "Type 2 Parvalbumin (PV)-positive interneuron":
    "Type 2 Parvalbumin (PV)-Positive Interneuron",
  BP: "Bipolar Cell",
  BTC: "Bitufted Cell",
  IPC: "Inverted Pyramidal Cell",
  MC: "Martinotti Cell",
  NGC: "Neurogliaform Cell",
  "Type 1 Parvalbumin (PV)-positive interneuron":
    "Type 1 Parvalbumin (PV)-Positive Interneuron",
  DBC: "Double Bouquet Cell",
  SBC: "Single Bouquet Cell",
  "Fast-spiking basket interneuron": "Fast-spiking Basket Interneuron",
  BPC: "Bipolar Pyramidal Cell",
  CHC: "Chandelier Cell",
  ChC: "Chandelier Cell",
  NBC: "Nest Basket Cell",
  HPC: "Horizontal Pyramidal Cell",
  LBC: "Large Basket Cell",
  HAC: "Horizontal Axon Cell",
  DAC: "Descending Axon Cell",
  "Type 1 Parvalbumin (PV)-positive basket interneuron":
    "Type 1 Parvalbumin (PV)-Positive Basket Interneuron",
  SAC: "Small Axon Cell",
  LAC: "Large Axon Cell",
  SSC: "Spiny Stellate Cell"
};


export default Object.keys(glossary).reduce((memo, key) => {
  memo[key.toLowerCase()] = glossary[key];
  return memo;
}, {});
