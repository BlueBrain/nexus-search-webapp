// TODO remove old download anchor tags from polluting the DOM
export default (base64DataURL, fileName) => {
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = base64DataURL;
  link.setAttribute('type', 'hidden');
  // for reference
  link.setAttribute('saveAs', true);
  link.setAttribute('download', fileName);
  link.click();
}