import qs from "query-string";

export default routing => {
  const selectedType = qs.parse(routing.location.search).type;
  const queryTerm = qs.parse(routing.location.search).q;
  const selectedFacets = JSON.parse(qs.parse(routing.location.search).filter || "{}");
  const filter = qs.parse(routing.location.search).filter;
  return {
    selectedType,
    selectedFacets,
    filter,
    queryTerm
  }
}