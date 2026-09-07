import https from 'https';

export async function POST(request) {
  const PIXEL_ID = '298836502481494';
  const TOKEN = process.env.CAPI_TOKEN;
  if (!TOKEN) return Response.json({ error: 'No token' }, { status: 500 });

  const body = await request.json();
  const postData = JSON.stringify(body);

  return new Promise((resolve) => {
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v18.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve(Response.json(JSON.parse(data))));
    });
    req.on('error', (e) => resolve(Response.json({ error: e.message }, { status: 500 })));
    req.write(postData);
    req.end();
  });
}
