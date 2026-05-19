// Netlify serverless function — secure Gemini API proxy for blog.html generator
// API key lives in Netlify env vars (GEMINI_API_KEY), never in browser JS.

const SYSTEM_PROMPT = `You are Thuy, a Master Nail Technician and Freehand Nail Art Specialist with 15+ years of experience based in Austin, TX 78725. You write expert nail care guides for your website blog.

WRITING STYLE:
- Authoritative but warm — you're the expert speaking directly to a client
- Use "I" naturally when sharing personal experience or opinion
- Specific and practical — give real numbers, real timeframes, real advice
- Optimistic but honest — don't oversell, give the full picture
- No fluff or padding — every sentence earns its place

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, and naturally throughout
- Include "Austin TX" or "Austin, Texas" where natural
- Use H2 and H3 headings that match real search queries
- Include a FAQ section at the end with 3–4 questions using <details><summary> tags
- Word count: 700–1000 words

FORMAT — respond ONLY with this JSON (no markdown fences, no preamble):
{
  "title": "Article H1 title (can include <em> tags for italics)",
  "metaTitle": "SEO title tag under 60 chars",
  "metaDescription": "Meta description 140–160 chars with keyword and location",
  "category": "Short category label (2–3 words)",
  "readTime": "X min read",
  "body": "Full HTML article body using only: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>, <ol>, <blockquote>, <hr>, <details>, <summary>, <div class=\\"callout\\"><strong>Tip</strong><p>...</p></div>. No inline styles. Include the booking CTA block."
}

BOOKING CTA — include exactly once near the end:
<div class="article-cta"><p>"Every set starts with a conversation. Text me your inspo."</p><a href="sms:+14259050469?body=Hi%20Thuy!%20I%27d%20like%20to%20book%20an%20appointment%20%F0%9F%92%85">📲 Text Thuy to Book</a></div>

Write for nailsbythuy.com — private nail studio in East Austin TX.`;

exports.handler = async (event) => {
  // GET /generate-article?debug=models — lists available Gemini models for this key
  if (event.httpMethod === 'GET' && event.queryStringParameters?.debug === 'models') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { statusCode: 500, body: 'No GEMINI_API_KEY set' };
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const body = await res.text();
    return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Service not configured — add GEMINI_API_KEY to Netlify env vars.' })
    };
  }

  let topic, category;
  try {
    ({ topic, category } = JSON.parse(event.body || '{}'));
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  if (!topic || typeof topic !== 'string' || topic.trim().length < 3 || topic.length > 220) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid topic' })
    };
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{
            parts: [{
              text: `Write a complete SEO nail care guide for: "${topic.trim()}"\nCategory: ${(category || 'Nail Care').slice(0, 60)}\nInclude Austin TX location signals naturally.`
            }]
          }],
          generationConfig: { maxOutputTokens: 2000 }
        })
      }
    );

    if (!upstream.ok) {
      const errBody = await upstream.text();
      console.error('Gemini error:', upstream.status, errBody);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Generation failed — please try again.', detail: errBody })
      };
    }

    const data = await upstream.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip optional JSON code fences
    const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

    // Validate parseable before returning to client
    JSON.parse(clean);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: clean
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error — please try again.', detail: String(err) })
    };
  }
};
