<template>
  <div id="app">
    <TouristMap />
  </div>
</template>

<script>
import TouristMap from './components/TouristMap.vue';

export default {
  name: 'App',
  components: {
    TouristMap,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

