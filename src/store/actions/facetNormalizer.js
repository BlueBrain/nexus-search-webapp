import { mapObj } from "../../libs/utils";

function mapFacets(selectedFacets) {
  try {
    let map = mapObj(selectedFacets, (obj, key) => {
      let [groupName, subgroupName] = key.split(".");
      return {
        key: groupName,
        filters: { [subgroupName]: obj }
      };
    });
    return map.reduce((memo, selectedFilter) => {
      memo[selectedFilter.key] = selectedFilter.filters;
      return memo;
    }, {});
  } catch (error) {
    console.error(error)
  }
}

export const facetNormalizer = function(response) {
  return Object.keys(response)
    .filter(key => !!response[key].doc_count)
    .sort((a, b) => response[b].doc_count - response[a].doc_count)
    .map(key => {
      let filter = response[key];
      // if (selected[key]) {
      //   Object.keys(selected[key]).forEach(selectedKey => {
      //     filter[selectedKey].buckets.map(bucket => {
      //       if (selected[key][selectedKey].indexOf(bucket.key) >= 0) {
      //         bucket.selected = true;
      //       } else {
      //         bucket.selected = false;
      //       }
      //       return bucket;
      //     });
      //   });
      // }
      filter.key = key;
      return filter;
    });
};

export const resultsToFacetWithSelection = function(
  facetResults,
  selectedFacets={}
) {
  console.log({facetResults})
  let selected = mapFacets(selectedFacets);
  facetResults.forEach(filter => {
    let key = filter.key;
    Object.keys(filter)
      .filter(key => key !== "doc_count" && key !== "key")
      .forEach(subGroupKey => {
        let subGroup = filter[subGroupKey];
        if (!subGroup.buckets) { return };
        subGroup.buckets.map(bucket => {
          if (
            selected[key] &&
            selected[key][subGroupKey] &&
            selected[key][subGroupKey].indexOf(bucket.key) >= 0
          ) {
            bucket.selected = true;
          } else {
            bucket.selected = false;
          }
          return bucket;
        });
      });
  });
  return facetResults;
};
