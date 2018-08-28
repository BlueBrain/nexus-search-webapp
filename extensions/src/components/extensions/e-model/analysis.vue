
<template>
  <div>
    <div
      class="analysis-container"
      v-if="analysisImgUrl"
    >
      <h3>E-Model traces</h3>
      <img
        :src="analysisImgUrl"
        class="analysis-img"
        @error="imgLoadError"
      >
    </div>
  </div>
</template>


<script>
  import first from 'lodash/first';
  import get from 'lodash/get';

  import nexus from '@/services/nexus';

  const openstackBase = 'https://bbpobjectstorage.epfl.ch/swift/v1/nmc-portal-data-O1.v6';

  // TODO: Use e-model traces from provenance
  const nexusQueryParams = {
    baseUrl: 'https://bbp-nexus.epfl.ch/staging',
    apiVer: 'v0',
    resource: 'data',
    organization: 'somatosensorycortexproject',
    domain: 'simulation',
    instanceType: 'emodelfeaturecollection',
    schemaVersion: 'v0.0.1',
  };

  export default {
    name: 'analysis-component',
    props: ['entityId'],
    data() {
      return {
        analysisImgUrl: null,
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      async init() {
        const emodel = await nexus.fetchEntity(this.entityId);
        const queryParams = {
          params: nexusQueryParams,
          fields: 'all',
          filter: {
            op: 'eq',
            path: 'schema:name',
            value: emodel.name,
          },
        };
        const featureCollection = await nexus.queryBy(queryParams);
        const reconstructionName = get(first(featureCollection.results), 'source.reconstructionName');
        this.analysisImgUrl = `${openstackBase}/memodel-traces/${reconstructionName}.png`;
      },
      imgLoadError() {
        this.analysisImgUrl = null;
      },
    },
  };
</script>


<style scoped>
  .analysis-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .analysis-img {
    margin-top: 24px;
    max-width: 700px;
  }
</style>
