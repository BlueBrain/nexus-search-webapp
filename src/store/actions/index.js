import navigateActions from "./navigate";
import instanceActions from "./instance";
import typeActions from "./type-actions";
import loadingActions from "./loading";
import queryActions from "./query";
import facetsActions from "./facets";
import lightboxActions from "./lightbox";
import searchActions from './search';
import {
  auth as authModule,
  searchBar as searchBarModule,
  searchResults as searchResultsModule
} from "../modules";

export const navigate = navigateActions;
export const instance = instanceActions;
export const loading = loadingActions;
export const auth = authModule.actions;
export const searchBar = searchBarModule.actions;
export const searchResults = searchResultsModule.actions;
export const types = typeActions;
export const query = queryActions;
export const facets = facetsActions;
export const lightbox = lightboxActions;
export const search = searchActions;
