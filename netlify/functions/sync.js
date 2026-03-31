// netlify/functions/sync.js
// Supabase-backed bidirectional sync for BFFSA Bridge App
// Secrets stored in Netlify environment variables — never hardcoded

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
const TABLE = 'app_sync';
const APP_ID = 'bffsa-bridge';

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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Supabase env vars — set SUPABASE_URL and SUPABASE_SECRET_KEY in Netlify' })
    };
  }

  const sbHeaders = {
    'apikey': SUPABASE_SECRET,
    'Authorization': `Bearer ${SUPABASE_SECRET}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const base = `${SUPABASE_URL}/rest/v1/${TABLE}`;

  try {
    // ── GET: Pull latest data ──
    if (event.httpMethod === 'GET') {
      const res = await fetch(
        `${base}?app_id=eq.${APP_ID}&order=updated_at.desc&limit=1`,
        { method: 'GET', headers: sbHeaders }
      );
      if (!res.ok) {
        const err = await res.text();
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Supabase GET failed: ' + err }) };
      }
      const rows = await res.json();
      if (!rows || rows.length === 0) {
        return { statusCode: 200, headers, body: JSON.stringify({ found: false }) };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ found: true, data: rows[0].data, updated_at: rows[0].updated_at })
      };
    }

    // ── POST: Push data (upsert) ──
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { data, client_ts } = body;
      if (!data) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No data in request body' }) };
      }

      const now = new Date().toISOString();

      // Step 1: Check if record exists
      const checkRes = await fetch(
        `${base}?app_id=eq.${APP_ID}&select=id`,
        { method: 'GET', headers: sbHeaders }
      );
      const existing = await checkRes.json();
      const exists = existing && existing.length > 0;

      // Step 2: PATCH if exists, POST if not
      const upsertRes = await fetch(
        exists ? `${base}?app_id=eq.${APP_ID}` : base,
        {
          method: exists ? 'PATCH' : 'POST',
          headers: sbHeaders,
          body: JSON.stringify({
            app_id: APP_ID,
            data: data,
            updated_at: now,
            client_ts: client_ts || now
          })
        }
      );

      if (!upsertRes.ok) {
        const errText = await upsertRes.text();
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Supabase upsert failed: ' + errText }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, updated_at: now })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message, stack: e.stack ? e.stack.split('\n')[0] : '' })
    };
  }
};
