# SwiftLink

A URL shortener with React, Node.js, MongoDB, Redis, token-bucket rate limiting and click analytics. Links are created after signing in; destinations use `/r/<code>`. The dashboard shows 30-day clicks, devices and referrer hostnames. It stores no IP addresses in click records. Each redirect writes analytics synchronously: correctness is prioritized over maximum throughput; benchmark before claiming high-traffic capacity or a percentage speedup.
