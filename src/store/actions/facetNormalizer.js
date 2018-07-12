import {mapObj} from "../../libs/utils";

function mapFacets (selectedFacets) {
  let map = mapObj(selectedFacets, (obj, key) => {
    let [groupName, subgroupName] = key.split('.');
    return {
      key: groupName,
      filters: { [subgroupName]: obj }
    }
  });
  return map.reduce((memo, selectedFilter) => {
    memo[selectedFilter.key] = selectedFilter.filters;
    return memo;
  }, {});
}

export const facetNormalizer = function (response, selectedFacets) {
  let selected = mapFacets(selectedFacets);
  return Object.keys(response)
    .filter(key => !!response[key].doc_count)
    .sort((a, b) => response[b].doc_count - response[a].doc_count)
    .map(key => {
      let filter = response[key];
      if (selected[key]) {
        Object.keys(selected[key]).forEach(selectedKey => {
          filter[selectedKey].buckets.map(bucket => {
            if (selected[key][selectedKey].indexOf(bucket.key) >= 0) {
              bucket.selected = true;
            }
            return bucket;
          })
        })
      }
      filter.key = key;
      return filter
    });
}

export const resultsToFacetWithSelection = function (facetResults, selectedFacets) {
  let selected = mapFacets(selectedFacets);
  return facetResults.map(filter => {
    let key = filter.key
    if (selected[key]) {
      Object.keys(selected[key]).forEach(selectedKey => {
        filter[selectedKey].buckets.map(bucket => {
          if (selected[key][selectedKey].indexOf(bucket.key) >= 0) {
            bucket.selected = true;
          }
          return bucket;
        })
      })
    }
    return filter;
  })
}
