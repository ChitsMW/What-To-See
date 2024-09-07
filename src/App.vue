<template>
  <div id="app">
    <TouristMap />
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4 mb-4">
          <img src="assets/image1.jpg" class="img-fluid" alt="Philly Museum">
        </div>
        <div class="col-md-4 mb-4">
          <img src="assets/image2.jpg" class="img-fluid" alt="Statue of Liberty">
        </div>
        <div class="col-md-4 mb-4">
          <img src="assets/image3.jpg" class="img-fluid" alt="DC Monument">
        </div>
      </div>
    </div>
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

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: -15px;
}

.col-md-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  padding: 15px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>


<!-- <template>
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
</style> -->


<!-- <template>
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
@import './style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
 -->
