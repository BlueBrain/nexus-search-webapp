import { mapObj } from "@libs/utils";
import { findWhere, findIndex } from "underscore";

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
    console.error(error);
  }
}

function moveEntryToEnd(array, predicate) {
  let index = findIndex(array, predicate);
  if (index > 0) {
    return array.push(array.splice(index, 1)[0]);
  }
}

export const facetNormalizer = function(response) {
  let facets = Object.keys(response)
    .filter(key => !!response[key].doc_count)
    .sort((a, b) => response[b].doc_count - response[a].doc_count)
    .map(key => {
      let filter = response[key];
      filter.key = key;
      return filter;
    });

  // We want to put these facets toward the end
  // because they're less interesting
  // than the scientific facets
  moveEntryToEnd(facets, entry => entry.key === "dataSource");
  moveEntryToEnd(facets, entry => entry.key === "license");
  moveEntryToEnd(facets, entry => entry.key === "contribution");

  return facets;
};

function getBuckets(filterGroup, parentKey) {
  return Object.keys(filterGroup)
    .filter(key => key !== "doc_count" && key !== "key")
    .reduce((memo, key) => {
      let subGroup = filterGroup[key];
      if (!subGroup.buckets) {
        let subBuckets = getBuckets(subGroup, key) || {};
        return (memo = Object.assign(memo, subBuckets));
      }
      memo[parentKey ? parentKey + "." + key : key] = subGroup;
      return memo;
    }, {});
}
/**
 *
 *
 * @param {*} facets
 * @param {*} group
 * @returns
 */
function flattenFiltersBySubgroup(facets, group) {
  facets.push(Object.assign(group, getBuckets(group)));
  return facets;
}

function addSelectedToFacet(filter, selected, facetBlacklist, path) {
  let key = filter.key;

  Object.keys(filter)
    .filter(key => key !== "doc_count" && key !== "key")
    .forEach(subGroupKey => {
      let subGroup = filter[subGroupKey];
      if (facetBlacklist.indexOf(subGroupKey) >= 0) {
        delete filter[subGroupKey];
        return;
      }
      if (!subGroup.buckets) {
        return;
      }
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
}

export const resultsToFacetWithSelection = function(
  facetResults,
  selectedFacets = {},
  facetBlacklist = []
) {
  let selected = mapFacets(selectedFacets);
  facetResults
    .reduce(flattenFiltersBySubgroup, [])
    .forEach(filter => addSelectedToFacet(filter, selected, facetBlacklist));
  return facetResults.filter(filter => {
    let key = filter.key;
    return facetBlacklist.indexOf(key) < 0;
  });
};
