exports.handler = async function(event) {
if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
const apiKey = process.env.ANTHROPIC_API_KEY;
try {
const body = JSON.parse(event.body);
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 25000);
const response = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
body: JSON.stringify(body),
signal: controller.signal
});
clearTimeout(timeout);
const data = await response.json();
return { statusCode: response.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) };
} catch(err) {
return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: { message: err.message } }) };
}
};
