
<template>
  <div>
    <link-list :links="links"/>
  </div>
</template>


<script>
  import LinkList from '@/components/shared/link-list.vue';

  const links = [{
    label: 'Neuron as a service',
    href: '#',
  }, {
    label: 'Topological Morphology Descriptor',
    href: '#',
  }, {
    label: 'Analysis in Jupyter Notebook',
    href: '#',
  }];

  export default {
    name: 'me-model-tools',
    components: {
      'link-list': LinkList,
    },
    data() {
      return {
        links,
      };
    },
  };
</script>
