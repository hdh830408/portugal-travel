import { init } from './app.js';

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

document.addEventListener('DOMContentLoaded', init);