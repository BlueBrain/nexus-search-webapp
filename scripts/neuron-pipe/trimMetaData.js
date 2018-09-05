const keysToDelete = [
  "@context",
  "@type",
  "links",
  "nxv:rev",
  "nxv:deprecated"
];


export default function trimMetaData (doc) {
  keysToDelete.forEach(key => {
    if (doc[key]) {
      delete doc[key];
    }
  });
  if (doc.distribution) {
    doc.distribution = doc.distribution.map(entry => trimMetaData(entry));
  }
  return doc;
};
