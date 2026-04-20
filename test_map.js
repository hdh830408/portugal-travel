const url = 'https://www.google.com/maps/place/Cafe+A+Brasileira/@38.7106093,-9.1444154,17z/data=!3m1!4b1!4m6!3m5!1s0xd19347c61bf8703:0x12b5d496a7baf3cc!8m2!3d38.7106051!4d-9.1420905!16zL20vMGIwc2R4?entry=ttu';
fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(url))
  .then(res => res.json())
  .then(data => {
     console.log('Got response length:', data.contents.length);
     const titleMatch = data.contents.match(/<title>(.*?)<\/title>/);
     const metaMatch = data.contents.match(/<meta[^>]*itemprop=.description.*?>/i);
     console.log('Title:', titleMatch ? titleMatch[1] : 'None');
     console.log('Meta:', metaMatch ? metaMatch[0] : 'None');
  }).catch(e => console.error(e));
