const glossary = {
  DAC: "Descending Axon Cell",
  "NGC-DA": "Neurogliaform Cell with dense axonal arborization",
  "NGC-SA": "Neurogliaform Cell with slender axonal arborization",
  HAC: "Horizontal Axon Cell",
  HPC: "Horizontal Pyramidal Cell",
  LAC: "Large Axon Cell",
  SAC: "Small Axon Cell",
  MC: "Martinotti Cell",
  BTC: "Bitufted Cell",
  DBC: "Double Bouquet Cell",
  BP: "Bipolar Cell",
  NGC: "Neurogliaform Cell",
  LBC: "Large Basket Cell",
  NBC: "Nest Basket Cell",
  SBC: "Small Basket Cell",
  ChC: "Chandelier Cell",
  PC: "Pyramidal Cell",
  SP: "Star Pyramidal Cell",
  SS: "Spiny Stellate Cell",
  TTPC1: "Thick-tufted Pyramidal Cell with a late bifurcating apical tuft",
  TTPC2: "Thick-tufted Pyramidal Cell with an early bifurcating apical tuft",
  UTPC: "Untufted Pyramidal Cell",
  STPC: "Slender-tufted Pyramidal Cell",
  TPC: "Tufted Pyramidal Cell with apical dendrites",
  TPC_L4: "Tufted Pyramidal Cell with apical dendrites terminating in layer 4",
  TPC_L1: "Tufted Pyramidal Cell with apical dendrites terminating in layer 1",
  IPC: "Pyramidal Cell with inverted apical-like dendrites",
  BPC: "Pyramidal Cell with bipolar apical-like dendrites"
};

export default Object.keys(glossary).reduce((memo, key) => {
  memo[key.toLowerCase()] = glossary[key];
  return memo;
}, {});