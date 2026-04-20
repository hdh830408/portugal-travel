const url = 'https://maps.app.goo.gl/tPKU6XqkJ1CdKs9RA';
fetch('https://api.microlink.io/?url=' + encodeURIComponent(url))
  .then(res => res.json())
  .then(data => {
    console.log('Title:', data.data.title);
    console.log('Desc:', data.data.description);
  })
  .catch(e => console.error(e));
