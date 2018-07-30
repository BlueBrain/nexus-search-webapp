
<template>
  <div>
    <link-list :links="links"/>
  </div>
</template>


<script>
  import config from '@/config';
  import nexus from '@/services/nexus';

  import LinkList from '@/components/shared/link-list.vue';

  export default {
    name: 'e-model-tools',
    props: ['entityId'],
    components: {
      'link-list': LinkList,
    },
    data() {
      return {
        links: [{
          label: 'Neuron as a service',
          href: this.getBlueNaasUrl(),
        }, {
          label: 'Analysis in Jupyter notebook',
          href: this.getAnalysisNotebookUrl(),
        }],
      };
    },
    methods: {
      getBlueNaasUrl() {
        const uuid = nexus.getIdAttribute(this.entityId, 'uuid');
        return `${config.externalApps.blueNaasBaseUrl}/${uuid}`;
      },
      getAnalysisNotebookUrl() {
        return '#';
      },
    },
  };
</script>
