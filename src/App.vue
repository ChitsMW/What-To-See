<template>
  <div>
    <div>
      <h1>
        What Shall We Go Today?
      </h1>
      <br>
    </div>
    <div class="container mb-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="controls-container">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="searchQuery"
                @keyup.enter="searchLocation"
                placeholder="Enter a location"
              />
              <div class="input-group-append">
                <button class="btn btn-primary" @click="searchLocation">
                  Search
                </button>
              </div>
            </div>
            <div class="dropdown ms-2">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{ selectedType || 'All Types' }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <a class="dropdown-item" href="#" @click="selectType('')">
                    All Types
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click="selectType('tourist_attraction')"
                  >
                    Tourist Attraction
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click="selectType('museum')"
                  >
                    Museum
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="selectType('park')">
                    Park
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click="selectType('amusement_park')"
                  >
                    Amusement Park
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click="selectType('art_gallery')"
                  >
                    Art Gallery
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
   
    </div>
    <div class="map-container">
      <div ref="mapRef" style="width: 100%; height: 500px;"></div>
    </div>
    <br>
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
</template>

<script>
export default {
  name: 'TouristMap',
  data() {
    return {
      map: null,
      mapCenter: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
      places: [],
      markers: [],
      searchQuery: '',
      selectedType: '',
      infoWindow: null,
      placesService: null,
    };
  },
  methods: {
    initMap() {
      if (window.google && window.google.maps) {
        this.map = new window.google.maps.Map(this.$refs.mapRef, {
          center: this.mapCenter,
          zoom: this.zoom,
        });
        this.infoWindow = new window.google.maps.InfoWindow();
        this.placesService = new window.google.maps.places.PlacesService(this.map);
        this.fetchPlaces();
      } else {
        console.error('Google Maps API is not loaded');
      }
    },
    searchLocation() {
      if (!this.searchQuery) {
        alert('Please enter a location to search.');
        return;
      }

      const request = {
        query: this.searchQuery,
        fields: ['name', 'geometry'],
      };

      this.placesService.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const place = results[0];
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(14);
          this.fetchPlaces();
        } else {
          console.error('Search failed:', status);
        }
      });
    },
    fetchPlaces() {
      if (!this.map || !this.placesService) return;

      const request = {
        location: this.map.getCenter(),
        radius: '5000',
        type: this.selectedType ? [this.selectedType] : ['tourist_attraction', 'museum', 'park', 'amusement_park', 'art_gallery'],
      };

      this.placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          this.clearMarkers();
          results.forEach((place) => {
            const marker = new window.google.maps.Marker({
              map: this.map,
              position: place.geometry.location,
            });

            this.markers.push(marker);
            marker.addListener('click', () => {
              this.infoWindow.setContent(place.name);
              this.infoWindow.open(this.map, marker);
            });
          });
        } else {
          console.error('Places search failed:', status);
        }
      });
    },
    selectType(type) {
      this.selectedType = type;
      this.fetchPlaces();
    },
    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (window.google && window.google.maps) {
        this.initMap();
      } else {
        console.error('Google Maps API is not loaded. Please check your main.js configuration.');
      }
    });
  },
};
</script>

<style>
.controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.input-group {
  max-width: 600px;
}
.dropdown {
  margin-left: 10px;
}
.map-container {
  width: 100%;
  height: 500px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}
body {
  background: linear-gradient(135deg, #4CAF50, #2196F3);
  min-height: 100vh;
}
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
