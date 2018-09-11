import IonChannel from "./IonChannel";
import Cell from "./Cell";

const detailsPageTypes = {
  Cell,
  IonChannel
}

export default {
  getPageType (typeLabel="Cell", studyType="Experimental") {
    return detailsPageTypes[typeLabel.replace(" ", "")][studyType.replace(" ", "")];
  }
}