const https = require('https');

https.get('https://dns.google/resolve?name=_mongodb._tcp.cluster0.4qimgil.mongodb.net&type=SRV', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("SRV Records:", parsed.Answer);
    } catch(e) {
      console.error(e);
    }
  });
}).on('error', err => console.error(err));
