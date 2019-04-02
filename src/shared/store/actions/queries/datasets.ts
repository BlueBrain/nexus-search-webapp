import { PaginationSettings } from '@bbp/nexus-sdk';

export const makeDatasetQuery = (paginationSettings: PaginationSettings) => `
prefix nxv: <https://bluebrain.github.io/nexus/vocabulary/>

SELECT ?total ?s
WITH {
	SELECT DISTINCT ?s
        WHERE {
  			{
             ?s nxv:constrainedBy <https://neuroshapes.org/dash/dataset> .
  			}
		}
} AS %resultSet

WHERE {
     {
        SELECT (COUNT(?s) AS ?total)
        WHERE { INCLUDE %resultSet }
     }
     UNION
    {
        SELECT *
        WHERE { INCLUDE %resultSet }
        ORDER BY ?s
        LIMIT ${paginationSettings.size}
        OFFSET ${paginationSettings.from}
     }
  }
`;
