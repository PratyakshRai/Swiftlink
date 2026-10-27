// Vercel calls this single function for API and short-link routes.
// The application module is cached by Node across warm invocations.
let appPromise;
export default async function handler(req, res) {
  try {
    const incoming = new URL(req.url, 'https://internal.invalid');
    const route = incoming.searchParams.get('__route');
    if (!route || !/^\/(api\/(?:register|login|logout|me|links(?:\/[a-fA-F0-9]{24})?|analytics)|r\/[A-Za-z0-9_-]{1,32}|health)$/.test(route)) {
      return res.status(404).json({error:'Not found.'});
    }
    incoming.searchParams.delete('__route');
    req.url = route + (incoming.searchParams.size ? '?' + incoming.searchParams.toString() : '');
    appPromise ||= import('../server/index.js').then(module => module.app).catch(error => { appPromise = undefined; throw error; });
    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    console.error('SwiftLink initialization failed:', error.message);
    if (!res.headersSent) res.status(503).json({error:'Service unavailable. Please try again.'});
  }
}
