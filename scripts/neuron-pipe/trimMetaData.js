const keysToDelete = [
  "@context",
  "@type",
  "links",
  "nxv:rev",
  "nxv:deprecated"
];

export default function trimMetaData(doc) {
  keysToDelete.forEach(key => {
    if (doc[key]) {
      delete doc[key];
    }
  });
  if (doc.distribution) {
    doc.distribution = doc.distribution.map(entry => {
      if (Array.isArray(entry)) {
        console.log("There are strange distribution artifacts!");
        return null;
      }
      return trimMetaData(entry);
    });
  }
  return doc;
}
