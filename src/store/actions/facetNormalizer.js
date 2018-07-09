function facetNormalizer(response) {
  return Object.keys(response)
    .filter(key => !!response[key].doc_count)
    .sort((a, b) => response[b].doc_count - response[a].doc_count)
    .map(key => {
      let filter = response[key];
      console.log("hello !!!", {filter})
      filter.key = key;
      return filter
    });
}

export default facetNormalizer;
