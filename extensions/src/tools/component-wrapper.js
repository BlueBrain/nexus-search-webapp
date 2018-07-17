
import Vue from 'vue';

/**
 * A node in the DOM tree.
 *
 * @external Node
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node}
 */

/**
 * @typedef {Object} ExtensionProps
 * @property {string} name - User friendly name of the extension
 */

function createExtension(component) {
  class Extension {
    /**
     * @property {ExtensionProps}
     */
    static get props() { return component.props; }

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

      this.component = new Vue({
        el: mountElement,
        render: h => h(component.VueComponent, { props: params }),
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
