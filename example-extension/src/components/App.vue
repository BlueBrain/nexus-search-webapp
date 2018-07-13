<template>
  <div id="app">
    <button v-on:click="randomEmoji">
      <h1>{{ message }} {{msg.data}}</h1>
    </button>
  </div>
</template>

<script>
import emoji from "random-emoji";

function randomizeEmoji () {
  return emoji.random({count: 5}).map(entry => entry.character).join(" ");
}

export default {
  name: "App",
  props: ["msg"],
  data: () => {
    return {
      message: randomizeEmoji()
    }
  },
  methods: {
    randomEmoji: function () {
      this.message = randomizeEmoji();
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  text-align: center;
  height: 100%;
  width: 100%;
}
button {
  background: white url(https://subtlepatterns.com/patterns/geometry2.png) repeat 0 0;
  box-shadow: 0 3px 5px grey;
  margin: 1em;
  cursor: pointer;
  animation: slide 10s linear infinite;
  border-color: transparent;
  font-size: 1.25rem;
  border-radius: 5px;
  padding: 1rem;
  transition: all 0.2s ease-out;
  background-size: 100px 100px;
  position: relative;
  top: 0;
}
button:focus {
  outline: none;
}
button:focus-within {
  top: 2px;
  box-shadow: 0 1px 2px grey;
}

@-webkit-keyframes slide {
    from { background-position: 0 0; }
    to { background-position: -400px 0; }
}
</style>