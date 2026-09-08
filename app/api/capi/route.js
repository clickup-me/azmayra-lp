import https from 'https';

export async function POST(request) {
  const PIXEL_ID = '298836502481494';
  const TOKEN = process.env.CAPI_TOKEN;
  if (!TOKEN) return Response.json({ error: 'No token' }, { status: 500 });

  // Ambil IP dari request headers
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip')
    || null;

  const body = await request.json();

  // Inject client_ip_address ke setiap event
  if (body.data && Array.isArray(body.data)) {
    body.data = body.data.map(event => ({
      ...event,
      user_data: {
        ...event.user_data,
        ...(clientIp ? { client_ip_address: clientIp } : {})
      }
    }));
  }

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
