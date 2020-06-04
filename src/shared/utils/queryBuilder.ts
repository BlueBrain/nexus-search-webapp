import { RequestParams } from '@elastic/elasticsearch';

export type FilterParams = {
  [filterTermKey: string]: string[];
};

export type Pagination = {
  from: number;
  size: number;
};

export type ESQueryParams = {
  filter?: FilterParams | null;
  q?: string;
  sort?: null;
  pagination?: Pagination;
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
  const { sort, filter, q, pagination } = query;

  // TODO add sorting
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
  }
  if (filter) {
    // MUST is an AND, we do it for terms across filter sets
    // such as BrainRegion and Species
    const must = Object.keys(filter).map(key => {
      // SHOULD is an OR, we do it for terms in the same filter set
      // such as Species:Rat and Species:Mouse
      const should = filter[key].map(filterTerm => {
        const propertyName = key;
        return { term: { [propertyName]: filterTerm } };
      });

      // For nested queries, every part of the path needs to contain
      // its ancestors, as in "grandparent.parent.value"
      const path = key.split('.').reduce((previous, current) => {
        const parentLabel = previous[previous.length - 1] || null;
        const currentLabel = parentLabel
          ? `${parentLabel}.${current}`
          : current;
        previous.push(currentLabel);
        return previous;
      }, [] as string[]);

      return path.reverse().reduce((memo, level, index) => {
        if (index === 0) {
          return {
            bool: {
              should,
            },
          };
        }
        return {
          nested: {
            path: level,
            query: memo,
          },
        };
      }, {});
    });
    if (must.length) {
      params.query.bool.must.push({
        bool: {
          must,
        },
      });
    }
  }
  if (pagination) {
    params.size = pagination.size;
    params.from = pagination.from;
  }
  return params;
}

export default buildQuery;
