import { getInstancesList } from "./helpers";
import to from "./to";

export default async config => {
  const { token, base, org, domain, context, schema, ver } = config;
  let instance = null;
  const nexusRequestOptions = {
    deprecated: false,
    fields: "all",
    size: 9999
  };
  const boundary = [org, domain, schema, ver, instance].indexOf("instance");
  const uriParts = [org, domain, schema, ver, instance].slice(0, boundary);
  let [error, docs] = await to(getInstancesList(uriParts, nexusRequestOptions, base, true, token))
  if (error) { throw error; }
  return docs.results;
}
//         .then(docs => {
//           if (!docs) {
//             return reject(new Error("No documents found"));
//           }
//           console.log("getInstancesListResponse: ", docs.total, docs.results.length);
//           processedDocuments[DOC_TYPE] = docs.results.map(doc => {
//             doc = doc.source;
//             doc["@type"] = DOC_TYPE;
//             delete doc.links;
//             delete doc["nxv:rev"];
//             delete doc["nxv:deprecated"];
//             delete doc["@context"];
//             // change mapping?
//             doc.brainRegion = doc.brainLocation.brainRegion;
//             delete doc.brainLocation;
//             doc.cellName = {
//               label: doc.name
//             };
//             delete doc.name;
//             return doc;
//           });
//           let promises = processedDocuments[DOC_TYPE].map(doc => {
//             let targetResourceType = "nsg:Trace";
//             return getRelatedResource(config, doc["@id"], targetResourceType);
//           });
//           return Promise.all(promises);
//         })
//         .then(traces => {
//           processedDocuments[DOC_TYPE].forEach((doc, index) => {
//             doc.traces = traces[index].results.map(trace => trace.source);
//           })
//           console.log("traces", traces.reduce((memo, trace) => {
//             memo += trace.total;
//             return memo;
//           }, 0));
//           resolve(processedDocuments);
//         })
//         .catch(reject);
//     })
//   );
// };
