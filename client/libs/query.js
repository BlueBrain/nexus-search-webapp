import qs from "query-string";

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_LIST_TYPE = "Grid";

export default (search = window.location.search) => {
  let {
    type = null,
    q = null,
    filter = "{}",
    sort = JSON.stringify({}),
    from = 0,
    listType = DEFAULT_LIST_TYPE,
    size = DEFAULT_PAGE_SIZE
  } = qs.parse(search);

  filter = JSON.parse(filter);
  sort = JSON.parse(sort);

  return {
    type,
    q,
    filter,
    sort,
    from: Number(from),
    size: Number(size),
    listType
  };
};
