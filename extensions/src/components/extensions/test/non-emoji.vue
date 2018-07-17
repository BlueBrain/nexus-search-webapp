
<template>
  <div>
    <h3>No emoji here</h3>
    <p>
      This extension accepts <pre>text</pre> property.
      You can test this by adding <pre>{"text": "Works!"}</pre> to params textbox
    </p>
    <strong>Text from params: {{ text }}</strong>
  </div>
</template>


<script>
  export default {
    name: 'test-no-emoji-extension',
    props: ['text'],
    mounted() {},
  };
</script>


<style lang="scss" scoped>
  pre {
    background-color: #fafafa;
    display: inline-block;
  }

  h3, p {
    margin-bottom: 1rem;
  }
</style>
