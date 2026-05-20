// Google Places API proxy — returns live reviews for Nails by Thuy
// API key lives in GOOGLE_PLACES_API_KEY env var (Netlify UI → Site config → Env vars)
// Response is CDN-cached for 24 h (s-maxage=86400) — Google is called at most once per day.

const PLACE_ID = 'ChIJpWwrrsS5RIYRKrruowqxcgk';
const PLACES_URL = `https://maps.googleapis.com/maps/api/place/details/json`
  + `?place_id=${PLACE_ID}`
  + `&fields=rating,user_ratings_total,reviews`
  + `&reviews_sort=newest`
  + `&language=en`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not configured' })
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let resp;
    try {
      resp = await fetch(`${PLACES_URL}&key=${apiKey}`, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (!resp.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Places API request failed' })
      };
    }

    const data = await resp.json();
    if (data.status !== 'OK') {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Places API error' })
      };
    }

    const result = {
      rating: data.result.rating,
      total: data.result.user_ratings_total,
      reviews: (data.result.reviews || [])
        .filter(r => r.text && r.text.trim().length > 20)
        .map(r => ({
          stars: r.rating,
          text: r.text.trim(),
          author: r.author_name,
          date: new Date(r.time * 1000).toLocaleDateString('en-US', {
            month: 'long', year: 'numeric'
          })
        }))
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // CDN caches for 24 h — Google is called at most once per day site-wide
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Vary': 'Accept-Encoding'
      },
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.error('get-reviews error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error' })
    };
  }
};
