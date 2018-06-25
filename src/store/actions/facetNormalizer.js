import { flatten, compact } from "underscore";

const PATH_SEPERATOR = "."

function makeFacetsFromAggs (o, path) {
  return compact(flatten(Object.keys(o).map(key => {
    let newPath = path ? path + PATH_SEPERATOR + key : key;
    let currentObject = o[key];
    let isObject = currentObject === Object(currentObject)
    if (isObject && currentObject.buckets) {
      return {
        title: newPath,
        total: currentObject.buckets.reduce((total, bucket) => total += bucket.doc_count, 0),
        facetOptions: currentObject.buckets.map(bucket => {
          return {
            label: bucket.key,
            value: bucket.key,
            amount: bucket.doc_count
          };
        })
      }
    } else if (isObject && typeof currentObject.buckets === "undefined") {
      return makeFacetsFromAggs(currentObject, newPath)
    } else {
      return null;
    }
  })))
}

function facetNormalizer(response) {
  return makeFacetsFromAggs(response)
    .sort((a, b) => b.total - a.total);
}

export default facetNormalizer;
