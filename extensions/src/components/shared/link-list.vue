
<template>
  <div>
    <div
      v-for="link in links"
      :key="link.label"
    >
      <a :href="link.href">{{ link.label }}</a>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'link-list',
    props: ['links'],
  };
</script>

