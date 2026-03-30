// /.netlify/functions/sync
// Supabase-backed bidirectional sync for BFFSA Bridge App
// Secrets stored in Netlify environment variables — never hardcoded

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
const TABLE = 'app_sync';

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing env vars' }) };
  }

  const sbHeaders = {
    'apikey': SUPABASE_SECRET,
    'Authorization': `Bearer ${SUPABASE_SECRET}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (event.httpMethod === 'GET') {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}?app_id=eq.bffsa-bridge&order=updated_at.desc&limit=1`,
        { headers: sbHeaders }
      );
      const rows = await res.json();
      if (!rows || rows.length === 0) {
        return { statusCode: 200, headers, body: JSON.stringify({ found: false }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ found: true, data: rows[0].data, updated_at: rows[0].updated_at }) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { data, client_ts } = body;
      if (!data) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No data' }) };

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}?app_id=eq.bffsa-bridge`,
        {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({
            app_id: 'bffsa-bridge',
            data: data,
            updated_at: new Date().toISOString(),
            client_ts: client_ts || null
          })
        }
      );
      const result = await res.json();
      if (res.ok) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true, updated_at: result[0]?.updated_at }) };
      } else {
        return { statusCode: 500, headers, body: JSON.stringify({ error: result }) };
      }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
