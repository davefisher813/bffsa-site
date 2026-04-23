// netlify/functions/files-upload-init.js
// Mints a signed upload URL for Supabase Storage using raw REST API.
// No npm dependencies — uses Node 18+ global fetch (Netlify default runtime).

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
    const scope = body.scope;
    if (scope !== 'athlete' && scope !== 'board') {
      return { statusCode: 400, headers: CORS, body: 'Invalid scope (must be athlete or board)' };
    }
    if (!body.fileName) {
      return { statusCode: 400, headers: CORS, body: 'Missing fileName' };
    }

    // Sanitize and construct storage path
    const safeName = String(body.fileName).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
    const fileId = body.fileId || Date.now();
    const bucket = scope === 'athlete' ? 'athlete-files' : 'board-files';

    let storagePath;
    if (scope === 'athlete') {
      const safeInit = String(body.athleteInit || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
      if (!safeInit) {
        return { statusCode: 400, headers: CORS, body: 'Missing athleteInit' };
      }
      storagePath = safeInit + '/' + fileId + '_' + safeName;
    } else {
      const safeFolder = String(body.folderId || 'root').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30) || 'root';
      storagePath = safeFolder + '/' + fileId + '_' + safeName;
    }

    // Call Supabase REST API to create a signed upload URL
    const signRes = await fetch(
      SUPABASE_URL + '/storage/v1/object/upload/sign/' + bucket + '/' + storagePath,
      {
        method: 'POST',
        headers: {
          'apikey': KEY,
          'Authorization': 'Bearer ' + KEY,
          'Content-Type': 'application/json'
        },
        body: '{}'
      }
    );

    if (!signRes.ok) {
      const err = await signRes.text().catch(function() { return ''; });
      return {
        statusCode: 500,
        headers: CORS,
        body: 'Supabase sign failed (' + signRes.status + '): ' + err.slice(0, 300)
      };
    }

    const signData = await signRes.json();
    // Response shape: { url: "/object/upload/sign/bucket/path?token=JWT" }
    const relUrl = signData.url || '';
    const fullUrl = SUPABASE_URL + '/storage/v1' + relUrl;
    let token = '';
    try { token = new URL(fullUrl).searchParams.get('token') || ''; } catch (e) {}

    return {
      statusCode: 200,
      headers: Object.assign({}, CORS, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        uploadUrl: fullUrl,
        token: token,
        bucket: bucket,
        storagePath: storagePath
      })
    };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: 'Error: ' + (e.message || String(e)) };
  }
};
