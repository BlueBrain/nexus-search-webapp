import qs from "query-string";

export default () => {
  let { type=null, q=null, filter="{}" } = qs.parse(window.location.search);
  filter = JSON.parse(filter);
  return {
    type,
    q,
    filter
  }
}