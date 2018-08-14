
import Vue from 'vue';

/**
 * A node in the DOM tree.
 *
 * @external Node
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node}
 */

/**
 * @typedef {Object} ExtensionAttrs
 * @property {string} name - User friendly name of the extension
 * @property {string} iconType - Type of the icon, see https://ant.design/components/icon/
 */

function createExtension(component, defaultParams) {
  class Extension {
    /**
     * @property {ExtensionAttrs}
     */
    static get attrs() { return component.attrs; }

    /**
     * Create extension instance from Vue.js component
     * with given params and mount it withing rootElement provided
     *
     * @param {external:Node} rootElement - Element to mount extension
     * @param {object} params - Parameters object to pass to extension
     */
    constructor(rootElement, params) {
      const mountElement = document.createElement('div');
      rootElement.appendChild(mountElement);

      const componentParams = Object.assign({}, defaultParams, params);

      this.component = new Vue({
        el: mountElement,
        render: h => h(component.VueComponent, { props: componentParams }),
      });
    }

    /**
     * Destroy extension and remove it from the DOM
     */
    destroy() {
      if (!this.component) return;

      this.component.$destroy();
      this.component.$el.remove();
      this.component = null;
    }
  }

  return Extension;
}

export default createExtension;
