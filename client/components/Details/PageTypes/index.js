import IonChannel from "./IonChannel";
import Cell from "./Cell";

const detailsPageTypes = {
  Cell,
  IonChannel
}

export default {
  getPageType (typeLabel="Cell", studyType="Experimental") {
    // TODO why
    typeLabel = typeLabel || "Cell";
    studyType = studyType || "Experimental";
    // TODO this value is not yet supported
    if (studyType==="In Vitro") {
      studyType = "Experimental";
    }
    return detailsPageTypes[typeLabel.replace(" ", "")][studyType.replace(" ", "")];
  }
}