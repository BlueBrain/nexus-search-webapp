import { RequestParams } from '@elastic/elasticsearch';

export type FilterParams = {
  [filterTermKey: string]: string[];
};

export type ESQueryParams = {
  filter?: FilterParams | null;
  q?: string;
  sort?: null;
  pagination?: any;
};

function buildQuery(query: ESQueryParams): RequestParams.Search['body'] {
  const params: RequestParams.Search['body'] = {
    query: {
      bool: {
        must: [
          {
            // Don't search for deprecated resources!
            term: { _deprecated: false },
          },
        ],
      },
    },
  };
  const { sort, filter, q } = query;

  // TODO add sort
  // if (sort) {
  //   sort = JSON.parse(sort);
  //   if (sort.field) {
  //     if (sort.field === '@type') {
  //       let field = sort.field + '.raw';
  //       params.sort = [
  //         {
  //           [field]: {
  //             order: sort.order,
  //           },
  //         },
  //       ];
  //     } else {
  //       let field = sort.field + '.raw';
  //       params.sort = [
  //         {
  //           [field]: {
  //             order: sort.order,
  //             nested: {
  //               path: sort.field,
  //             },
  //           },
  //         },
  //       ];
  //     }
  //   }
  // }
  if (q) {
    params.query.bool.must.push({
      match: {
        _all_fields: q,
      },
    });
    // TODO how to speed up?
    // params.highlight = {
    //   fields: {
    //     "*": {}
    //   },
    //   require_field_match: false
    // }
  }
  // TODO implement filter
  // if (filter) {
  //   // MUST is an AND, we do it for terms across filter sets
  //   const must = Object.keys(filter).map(key => {
  //     // SHOULD is an OR, we do it for terms in the same filter set
  //     const should = filter[key].map(filterTerm => {
  //       const propertyName = `${key}.raw`;
  //       return { term: { [propertyName]: filterTerm } };
  //     });

  //     // For nested queries, every part of the path needs to contain
  //     // its ancestors, as in "grandparent.parent.value"
  //     const path = key.split('.').reduce((previous, current) => {
  //       const parentLabel = previous[previous.length - 1] || null;
  //       const currentLabel = parentLabel
  //         ? `${parentLabel}.${current}`
  //         : current;
  //       previous.push(currentLabel);
  //       return previous;
  //     }, []);

  //     return path.reverse().reduce((memo, level, index) => {
  //       if (index === 0) {
  //         memo = {
  //           bool: {
  //             should,
  //           },
  //         };
  //       } else {
  //         memo = {
  //           nested: {
  //             path: level,
  //             query: memo,
  //           },
  //         };
  //       }
  //       return memo;
  //     }, {});
  //   });
  //   if (must.length) {
  //     params.query.bool.must.push({
  //       bool: {
  //         must,
  //       },
  //     });
  //   }
  // }
  return params;
}

export default buildQuery;
