<template>
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