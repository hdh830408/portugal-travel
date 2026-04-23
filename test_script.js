const url = 'https://maps.app.goo.gl/tPKU6XqkJ1CdKs9RA';
fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(url))
  .then(res => res.json())
  .then(data => {
    const htmlText = data.contents;
    console.log('Response length:', htmlText.length);
    const titleMatch = htmlText.match(/<meta[^>]*property=\"og:title\"[^>]*content=\"([^\"]+)\"/i);
    const descMatch = htmlText.match(/<meta[^>]*property=\"og:description\"[^>]*content=\"([^\"]+)\"/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
    console.log('Desc:', descMatch ? descMatch[1] : 'No desc');
  })
  .catch(e => console.error(e));
