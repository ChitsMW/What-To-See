import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

function initGoogleMaps() {
  return new Promise((resolve, reject) => {
    window.initMap = resolve;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjbUH1XRgMqg8t4imnnC_xh3qkEgh_DHw&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

initGoogleMaps()
  .then(() => {
    app.mount('#app');
  })
  .catch((error) => {
    console.error('Failed to load Google Maps API:', error);
  });