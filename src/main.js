import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjbUH1XRgMqg8t4imnnC_xh3qkEgh_DHw&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

loadGoogleMapsAPI()
  .then(() => {
    const app = createApp(App);
    // You can add any global properties or plugins here if needed
    app.mount('#app');
  })
  .catch(error => {
    console.error('Failed to load Google Maps API:', error);
  });



// main.js
// import { createApp } from 'vue';
// import App from './App.vue';

// function loadGoogleMapsAPI() {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve(window.google);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjbUH1XRgMqg8t4imnnC_xh3qkEgh_DHw&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => resolve(window.google);
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// }

// async function initApp() {
//   try {
//     await loadGoogleMapsAPI();
//     createApp(App).mount('#app');
//   } catch (error) {
//     console.error('Google Maps API failed to load:', error);
//   }
// }

// initApp();



// import { createApp } from 'vue';
// import App from './App.vue';

// const API_KEY = 'AIzaSyBjbUH1XRgMqg8t4imnnC_xh3qkEgh_DHw'; // Replace with your actual API key

// function loadGoogleMapsAPI() {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve(window.google);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => resolve(window.google);
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// }


// async function initApp() {
//   try {
//     const google = await loadGoogleMapsAPI();
//     const app = createApp(App);
//     app.config.globalProperties.$google = google;
//     app.mount('#app');
//   } catch (error) {
//     console.error('Failed to load Google Maps API:', error);
//     const app = createApp(App);
//     app.mount('#app');
//   }
// }

// initApp();



// import { createApp } from 'vue';
// import App from './App.vue';
// import './style.css'; // Assuming style.css is in the src folder
// import 'bootstrap/dist/css/bootstrap.min.css';


// const app = createApp(App);

// function initGoogleMaps() {
//   return new Promise((resolve, reject) => {
//     window.initMap = resolve; // Assign resolve to the global initMap function
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjbUH1XRgMqg8t4imnnC_xh3qkEgh_DHw&libraries=places&callback=initMap`; // Callback triggers resolve
//     script.async = true;
//     script.defer = true;
//     script.onerror = reject; // Handle loading errors
//     document.head.appendChild(script); // Append script to the document head
//   });
// }

// // Load Google Maps API and mount the Vue app once the API is ready
// initGoogleMaps()
//   .then(() => {
//     app.mount('#app');
//   })
//   .catch((error) => {
//     console.error('Failed to load Google Maps API:', error);
//   });
