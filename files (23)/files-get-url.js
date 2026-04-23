// netlify/functions/files-get-url.js
// Mints a signed read URL for Supabase Storage using raw REST API.
// No npm dependencies — uses Node 18+ global fetch.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const KEY = process.env.SUPABASE_SECRET_KEY;
    if (!SUPABASE_URL || !KEY) {
      return { statusCode: 500, headers: CORS, body: 'Missing SUPABASE_URL or SUPABASE_SECRET_KEY env var' };
    }

    const body = JSON.parse(event.body || '{}');
    if (!body.bucket || !body.path) {
      return { statusCode: 400, headers: CORS, body: 'Missing bucket or path' };
    }

    // TTL clamp: 60s min, 30d max, default 1 hour
    let ttl = parseInt(body.ttl, 10);
    if (!ttl || isNaN(ttl)) ttl = 3600;
    ttl = Math.max(60, Math.min(ttl, 30 * 24 * 3600));

    // Call Supabase to create signed URL
    const signRes = await fetch(
      SUPABASE_URL + '/storage/v1/object/sign/' + body.bucket + '/' + body.path,
      {
        method: 'POST',
        headers: {
          'apikey': KEY,
          'Authorization': 'Bearer ' + KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresIn: ttl })
      }
    );

    if (!signRes.ok) {
      const err = await signRes.text().catch(function() { return ''; });
      return {
        statusCode: signRes.status === 404 ? 404 : 500,
        headers: CORS,
        body: 'Supabase sign failed (' + signRes.status + '): ' + err.slice(0, 300)
      };
    }

    const signData = await signRes.json();
    // Response shape (varies by version): { signedURL: "/..." } or { signedUrl: "/..." }
    const relUrl = signData.signedURL || signData.signedUrl || signData.url || '';
    let fullUrl = SUPABASE_URL + '/storage/v1' + relUrl;

    // If download=true or download=filename, append &download= to the URL
    if (body.download) {
      const dl = body.fileName ? encodeURIComponent(body.fileName) : '';
      fullUrl += '&download=' + dl;
    }

    return {
      statusCode: 200,
      headers: Object.assign({}, CORS, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        signedUrl: fullUrl,
        expiresAt: Date.now() + (ttl * 1000)
      })
    };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: 'Error: ' + (e.message || String(e)) };
  }
};
