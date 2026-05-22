// Fetches live aggregate rating for Nails by Thuy from Google Places API.
// Returns only {rating, total} — no review text, no PII.
// Response is CDN-cached 24 h (s-maxage=86400) so Google is called at most once per day.
// Requires GOOGLE_PLACES_API_KEY in Netlify env vars (Site config → Environment variables).

const PLACE_ID = 'ChIJpWwrrsS5RIYRKrruowqxcgk';

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not configured' }),
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`
      + `?place_id=${PLACE_ID}`
      + `&fields=rating%2Cuser_ratings_total`
      + `&key=${apiKey}`;

    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Places API request failed' }),
      };
    }

    const data = await resp.json();
    if (data.status !== 'OK' || !data.result) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Places API: ${data.status}` }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Vary': 'Accept-Encoding',
      },
      body: JSON.stringify({
        rating: data.result.rating,
        total: data.result.user_ratings_total,
      }),
    };
  } catch (err) {
    console.error('get-rating error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
