import qs from "query-string";

export default (search=window.location.search) => {
  let { type=null, q=null, filter="{}", from=0 } = qs.parse(search);
  filter = JSON.parse(filter);
  return {
    type,
    q,
    filter,
    from
  }
}