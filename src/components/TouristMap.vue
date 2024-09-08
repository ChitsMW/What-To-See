<template>
  <div>
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
                <li><a class="dropdown-item" href="#" @click="selectType('')">All Types</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('tourist_attraction')">Tourist Attraction</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('museum')">Museum</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('park')">Park</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('amusement_park')">Amusement Park</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('art_gallery')">Art Gallery</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-container">
      <div ref="mapRef" style="width: 100%; height: 500px;"></div>
    </div>
  </div>
</template>


<!-- <template>
  <div>
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
  </div>
</template> -->

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
      loading: true,
      mapError: false,
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
        this.loading = false;
      } else {
        console.error('Google Maps API is not loaded');
        this.mapError = true;
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
        type: this.selectedType || ['tourist_attraction', 'museum', 'park', 'amusement_park', 'art_gallery'],
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
      if (this.map) {
        this.fetchPlaces();
      }
    },
    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    }
  },
  mounted() {
    // Use Vue.nextTick to ensure the DOM is updated before initializing the map
    this.$nextTick(() => {
      if (window.google && window.google.maps) {
        this.initMap();
      } else {
        console.error('Google Maps API is not loaded. Please check your main.js configuration.');
        this.mapError = true;
      }
    });
  },
};
</script>

<style scoped>
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
</style>

<!-- <template>
  <div>
    <div class="container mb-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="controls-container">
            <div class="input-group">
              <input type="text" class="form-control" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Enter a location">
              <div class="input-group-append">
                <button class="btn btn-primary" @click="searchLocation">Search</button>
              </div>
            </div>
            <div class="dropdown ms-2">
              <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{ selectedType || 'All Types' }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a class="dropdown-item" href="#" @click="selectType('')">All Types</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('tourist_attraction')">Tourist Attraction</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('museum')">Museum</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('park')">Park</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('amusement_park')">Amusement Park</a></li>
                <li><a class="dropdown-item" href="#" @click="selectType('art_gallery')">Art Gallery</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-container">
      <div ref="mapRef" style="width: 100%; height: 500px;"></div>
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
    };
  },
  methods: {
    initMap() {
      // eslint-disable-next-line
      if (this.$google && this.$google.maps) {
        // eslint-disable-next-line
        this.map = new this.$google.maps.Map(this.$refs.mapRef, {
          center: this.mapCenter,
          zoom: this.zoom,
        });
        // eslint-disable-next-line
        this.infoWindow = new this.$google.maps.InfoWindow();
        this.fetchPlaces();
      } else {
        console.error('Google Maps API is not loaded');
      }
    },
    searchLocation() {
      console.log('Searching for:', this.searchQuery);
      // Implement search functionality
    },
    fetchPlaces() {
      console.log('Fetching places for type:', this.selectedType);
      // Implement fetching places from Google Maps API
    },
    selectType(type) {
      this.selectedType = type;
      this.fetchPlaces();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
};
</script>

<style scoped>
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
</style> -->


<!-- <template>
  <div>
    <input type="text" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Enter a location" />
    <select v-model="selectedType" @change="handleTypeChange">
      <option value="">All Types</option>
      <option value="tourist_attraction">Tourist Attraction</option>
      <option value="museum">Museum</option>
      <option value="park">Park</option>
      <option value="amusement_park">Amusement Park</option>
      <option value="art_gallery">Art Gallery</option>
    </select>
    <div ref="mapRef" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<script>
export default {
  name: 'TouristMap',
  data() {
    return {
      map: null,
      mapCenter: { lat: 37.7749, lng: -122.4194 }, // San Francisco by default
      zoom: 12,
      places: [],
      markers: [],
      searchQuery: '',
      selectedType: '',
      infoWindow: null,
    };
  },
  methods: {
    initMap() {
      this.map = new window.google.maps.Map(this.$refs.mapRef, {
        center: this.mapCenter,
        zoom: this.zoom,
      });
      this.infoWindow = new window.google.maps.InfoWindow();
      this.fetchPlaces();
    },
    handleTypeChange() {
      this.clearMarkers();
      this.fetchPlaces();
    },
    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    },
    fetchPlaces() {
      const service = new window.google.maps.places.PlacesService(this.map);
      const request = {
        location: new window.google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng),
        radius: '5000',
        type: this.selectedType ? [this.selectedType] : ['tourist_attraction', 'museum', 'park', 'amusement_park', 'art_gallery'],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          this.places = results;
          this.addMarkers();
        } else {
          console.error('Places service error:', status);
        }
      });
    },
    searchLocation() {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: this.searchQuery }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          this.mapCenter = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          this.map.setCenter(this.mapCenter);
          this.clearMarkers();
          this.fetchPlaces();
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    },
    addMarkers() {
      this.places.forEach(place => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name,
        });

        marker.addListener('click', () => {
          this.showPlaceDetails(place, marker);
        });

        this.markers.push(marker);
      });
    },
    showPlaceDetails(place, marker) {
      const service = new window.google.maps.places.PlacesService(this.map);
      service.getDetails({ placeId: place.place_id }, (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          let content = `<h2>${placeDetails.name}</h2>`;
          content += `<p>${placeDetails.formatted_address}</p>`;
          if (placeDetails.rating) {
            content += `<p>Rating: ${placeDetails.rating} / 5</p>`;
          }
          if (placeDetails.reviews && placeDetails.reviews.length > 0) {
            content += '<h3>Reviews:</h3><ul>';
            placeDetails.reviews.slice(0, 3).forEach(review => {
              content += `<li>${review.text} - ${review.author_name}</li>`;
            });
            content += '</ul>';
          } else {
            content += '<p>No reviews available.</p>';
          }

          this.infoWindow.setContent(content);
          this.infoWindow.open(this.map, marker);
        }
      });
    },
  },
  mounted() {
    if (window.google && window.google.maps) {
      this.initMap();
    } else {
      window.addEventListener('google-maps-loaded', this.initMap);
    }
  },
  beforeUnmount() {
    window.removeEventListener('google-maps-loaded', this.initMap);
  },
};
</script>

<style scoped>
select {
  margin-left: 10px;
}
</style>
 -->



<!-- <template>
  <div>
    <input type="text" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Enter a location" />
    <select v-model="selectedType" @change="handleTypeChange">
      <option value="">All Types</option>
      <option value="tourist_attraction">Tourist Attraction</option>
      <option value="museum">Museum</option>
      <option value="park">Park</option>
      <option value="amusement_park">Amusement Park</option>
      <option value="art_gallery">Art Gallery</option>
    </select>
    <div ref="mapRef" style="width: 100%; height: 500px;"></div>
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
    };
  },
  methods: {
    initMap() {
      this.map = new window.google.maps.Map(this.$refs.mapRef, {
        center: this.mapCenter,
        zoom: this.zoom,
      });
      this.infoWindow = new window.google.maps.InfoWindow();
      this.fetchPlaces();
    },
    handleTypeChange() {
      console.log('Type changed to:', this.selectedType);
      this.clearMarkers();
      this.fetchPlaces();
    },
    clearMarkers() {
      console.log('Clearing markers. Current count:', this.markers.length);
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      this.places = [];
      console.log('Markers cleared. New count:', this.markers.length);
    },
    fetchPlaces() {
      if (!this.map) {
        console.error('Map not initialized');
        return;
      }

      console.log('Fetching places for type:', this.selectedType);
      const service = new window.google.maps.places.PlacesService(this.map);
      const request = {
        location: new window.google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng),
        radius: '5000',
        type: this.selectedType ? [this.selectedType] : ['tourist_attraction', 'museum', 'park', 'amusement_park', 'art_gallery'],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log('Places fetched:', results.length);
          this.places = results;
          this.addMarkers();
        } else {
          console.error('Places service error:', status);
        }
      });
    },
    searchLocation() {
      if (!window.google) {
        console.error('Google Maps API not loaded');
        return;
      }

      console.log('Searching for location:', this.searchQuery);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: this.searchQuery }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          this.mapCenter = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          console.log('New map center:', this.mapCenter);
          this.map.setCenter(this.mapCenter);
          this.clearMarkers();
          this.fetchPlaces();
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    },
    addMarkers() {
      console.log('Adding markers for', this.places.length, 'places');
      this.places.forEach(place => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name,
        });

        marker.addListener('click', () => {
          this.showPlaceDetails(place, marker);
        });

        this.markers.push(marker);
      });
      console.log('Total markers after adding:', this.markers.length);
    },
    showPlaceDetails(place, marker) {
      const service = new window.google.maps.places.PlacesService(this.map);
      service.getDetails({ placeId: place.place_id }, (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          let content = `<h2>${placeDetails.name}</h2>`;
          content += `<p>${placeDetails.formatted_address}</p>`;
          if (placeDetails.rating) {
            content += `<p>Rating: ${placeDetails.rating} / 5</p>`;
          }
          content += '<h3>Reviews:</h3>';
          if (placeDetails.reviews && placeDetails.reviews.length > 0) {
            content += '<ul>';
            placeDetails.reviews.slice(0, 3).forEach(review => {
              content += `<li>${review.text} - ${review.author_name}</li>`;
            });
            content += '</ul>';
          } else {
            content += '<p>No reviews available.</p>';
          }

          this.infoWindow.setContent(content);
          this.infoWindow.open(this.map, marker);
        }
      });
    },
  },
  mounted() {
    if (window.google && window.google.maps) {
      this.initMap();
    } else {
      window.addEventListener('google-maps-loaded', this.initMap);
    }
  },
  beforeUnmount() {
    window.removeEventListener('google-maps-loaded', this.initMap);
  },
};
</script>

<style scoped>
select {
  margin-left: 10px;
}

</style> -->