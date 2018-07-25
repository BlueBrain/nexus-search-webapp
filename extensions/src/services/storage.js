
import set from 'lodash/set';
import get from 'lodash/get';

function getStoredProps(entityName, extName) {
  let oldExtProps = null;
  try {
    oldExtProps = JSON.parse(localStorage.getItem('extProps')) || {};
  } catch (error) {
    oldExtProps = {};
  }
  if (entityName && extName) {
    return get(oldExtProps, [entityName, extName]) || {};
  }
  return oldExtProps; // return full stored object to update
}

function saveExtProps(entityName, extName, params) {
  const oldExtProps = getStoredProps();
  const newProps = set(oldExtProps, [entityName, extName], params);

  localStorage.setItem('extProps', JSON.stringify(newProps));
}

export default {
  saveExtProps,
  getStoredProps,
};
