import IonChannel from "./IonChannel";
import Cell from "./Cell";

const detailsPageTypes = {
  "nxv:SearchCell": Cell,
  "nxv:IonChannel": IonChannel
};

export default {
  getPageType (typeLabel, studyType) {
    typeLabel = typeLabel || "Cell";
    studyType = studyType || "Experimental";
    // TODO this value is not yet supported
    if (studyType==="In Vitro") {
      studyType = "Experimental";
    }
    return detailsPageTypes[typeLabel.replace(" ", "")][studyType.replace(" ", "")];
  }
}