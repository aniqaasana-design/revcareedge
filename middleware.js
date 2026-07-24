export const config = {
  matcher: ['/((?!api|_next|assets|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)'],
};

// Known search engine crawler user-agent patterns
const CRAWLER_PATTERNS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'sogou', 'facebot', 'ia_archiver', 'alexa',
  'msnbot', 'ahrefsbot', 'semrushbot', 'dotbot', 'rogerbot',
  'screaming frog', 'uptimerobot', 'pingdom', 'gtmetrix',
  'google-inspectiontool', 'chrome-lighthouse', 'pagespeed',
  'apis-google', 'mediapartners-google', 'adsbot-google',
  'vercel', 'prerender',
];

export default function middleware(request) {
  const country = request.headers.get('x-vercel-ip-country');
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // Allow search engine crawlers regardless of country
  const isCrawler = CRAWLER_PATTERNS.some(bot => userAgent.includes(bot));
  if (isCrawler) return;

  // Allow US traffic (or if country header is missing — e.g. localhost dev)
  if (!country || country === 'US') return;

  // Block all other countries with a styled 403 page
  return new Response(BLOCKED_HTML, {
    status: 403,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

const BLOCKED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RevCare Edge — Access Restricted</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: linear-gradient(135deg, #0F1724 0%, #1a2744 50%, #0F1724 100%);
      color: #fff;
      padding: 24px;
    }
    .card {
      max-width: 520px;
      width: 100%;
      text-align: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 28px;
      padding: 56px 40px;
      backdrop-filter: blur(12px);
    }
    .shield {
      width: 72px;
      height: 72px;
      margin: 0 auto 28px;
      background: linear-gradient(135deg, #376D48, #2F5E40);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 32px -8px rgba(62,123,79,0.4);
    }
    .shield svg { width: 36px; height: 36px; color: #fff; }
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    h1 span { color: #4CAF6A; }
    p {
      font-size: 0.95rem;
      color: #94A3B8;
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(62,123,79,0.15);
      border: 1px solid rgba(62,123,79,0.25);
      border-radius: 999px;
      padding: 10px 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #4CAF6A;
    }
    .badge svg { width: 16px; height: 16px; }
    .footer-text {
      margin-top: 36px;
      font-size: 0.75rem;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="shield">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>
    </div>
    <h1>Access <span>Restricted</span></h1>
    <p>
      RevCare Edge services are currently available exclusively within the
      <strong style="color:#fff;">United States</strong>. We're unable to serve
      your region at this time.
    </p>
    <div class="badge">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 012-2v-1a2 2 0 012-2h1.945M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"/>
      </svg>
      US-Only Service
    </div>
    <p class="footer-text">&copy; ${new Date().getFullYear()} RevCare Edge. All rights reserved.</p>
  </div>
</body>
</html>`;
