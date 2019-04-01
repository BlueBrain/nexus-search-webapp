export const mindsQuery = `
SELECT DISTINCT ?speciesLabel ?speciesID ?brainRegionID ?brainRegionLabel ?contribution ?distribution ?license
{
  {
    ?s1 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion> ?brainRegionID .
    OPTIONAL { ?brainRegionID rdfs:label ?brainRegionLabel }
  } UNION {
    ?s3 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species> ?speciesID .
    OPTIONAL { ?speciesID rdfs:label ?speciesLabel }
  } UNION {
    ?s4 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/contribution> ?contribution .
  } UNION {
    ?s5 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/distribution> ?distribution .
  } UNION {
    ?s6 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/license> ?license .
  }
}
`;

// prefix schema: <http://schema.org/>
// prefix prov: <http://www.w3.org/ns/prov#>
// prefix nxv: <https://bluebrain.github.io/nexus/vocabulary/>

// SELECT ?self
// {
//   GRAPH ?g {
//     ?s1 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion> <http://purl.obolibrary.org/obo/UBERON_0008933> .
//   }
//   GRAPH ?g {
//     ?s nxv:constrainedBy ?oo .
//     ?self nxv:self ?banana
//   }

// }

// prefix schema: <http://schema.org/>
// prefix prov: <http://www.w3.org/ns/prov#>
// SELECT DISTINCT ?agentID ?fName
// {
//   {
// 	?s3 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/contribution> / prov:agent ?agentID .
//     OPTIONAL{ ?agentID schema:familyName ?fName }
//   }
// }

// prefix schema: <http://schema.org/>
// prefix prov: <http://www.w3.org/ns/prov#>
// SELECT DISTINCT ?agentID ?fName
// {
//   {
//     ?s3 <https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/contribution> ?contributionBN .
//     ?contributionBN prov:agent ?agentID .
//     OPTIONAL{ ?agentID schema:familyName ?fName }
//   }
// }
