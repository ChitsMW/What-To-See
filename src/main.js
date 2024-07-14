
import { createApp } from 'vue';
import App from './App.vue';
import * as VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App);

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBjbUH1XRgMqg8t4imnnC_xh3qkEgh_DHw',
    libraries: 'places',
  },
});

app.mount('#app');
  