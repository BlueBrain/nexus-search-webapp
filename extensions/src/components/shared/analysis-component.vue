
<template>
  <div>
    <h3>Analysis Component</h3>
    <div
      v-for="analysis in analysisList"
      :key="analysis.url"
      class="analysis-container"
    >
      <img
        :src="analysis.url"
        class="analysis-img"
      >
      Author: {{ analysis.author }}
    </div>
  </div>
</template>


<script>
  import mockup from './analysis-mock.json';

  export default {
    name: 'analysis-component',
    props: ['entityId'],
    computed: {
      analysisList() {
        // TODO replace with real data
        return mockup[this.entityId];
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
    max-width: 700px;
  }
</style>
