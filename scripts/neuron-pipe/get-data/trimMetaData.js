const keysToDelete = [
  "@context",
  "@type",
  "links",
  "nxv:rev",
  "nxv:deprecated"
];

export default doc => {
  keysToDelete.forEach(key => {
    if (doc[key]) {
      delete doc[key];
    }
  });
  return doc;
};
