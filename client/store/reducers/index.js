import instanceReducer from "./instance";
import listReducer from "./list";
import loaderReducer from "./loader";
import configReducer from "./config";
import queryReducer from "./query";
import facetsReducer from "./facets";
import typesReducer from "./types";
import lightboxReducer from "./lightbox";
import searchReducer from "./search";
import infoboxReducer from "./infobox";
import {
  auth as authModule,
  searchBar as searchBarModule,
  searchResults as searchResultsModule
} from "../modules";

export const instance = instanceReducer;
export const list = listReducer;
export const loader = loaderReducer;
export const config = configReducer;
export const auth = authModule.reducer;
export const searchBar = searchBarModule.reducer;
export const searchResults = searchResultsModule.reducer;
export const query = queryReducer;
export const facets = facetsReducer;
export const types = typesReducer;
export const lightbox = lightboxReducer;
export const search = searchReducer;
export const infobox = infoboxReducer;
