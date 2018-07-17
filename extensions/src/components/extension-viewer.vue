
<template>
  <div ref="container"></div>
</template>


<script>
  export default {
    name: 'extension-viewer',
    props: ['Extension', 'extParams'],
    beforeDestroy() {
      if (this.extension) this.extension.destroy();
    },
    mounted() {
      this.initExtension();
    },
    methods: {
      initExtension() {
        if (this.extension) this.extension.destroy();

        const rootEl = this.$refs.container;
        this.extension = new this.Extension(rootEl, this.extParams);
      },
    },
    watch: {
      Extension() {
        this.initExtension();
      },
      extParams() {
        this.initExtension();
      },
    },
  };
</script>
