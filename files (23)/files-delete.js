// netlify/functions/files-delete.js
// Deletes a file from Supabase Storage using raw REST API.
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

    // Supabase bulk delete endpoint: DELETE /storage/v1/object/{bucket}
    // Body: { prefixes: [path1, path2, ...] }
    const delRes = await fetch(
      SUPABASE_URL + '/storage/v1/object/' + body.bucket,
      {
        method: 'DELETE',
        headers: {
          'apikey': KEY,
          'Authorization': 'Bearer ' + KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefixes: [body.path] })
      }
    );

    if (!delRes.ok) {
      const err = await delRes.text().catch(function() { return ''; });
      return {
        statusCode: 500,
        headers: CORS,
        body: 'Supabase delete failed (' + delRes.status + '): ' + err.slice(0, 300)
      };
    }

    return {
      statusCode: 200,
      headers: Object.assign({}, CORS, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: 'Error: ' + (e.message || String(e)) };
  }
};
