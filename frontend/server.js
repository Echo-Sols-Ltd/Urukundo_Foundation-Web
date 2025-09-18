import { createServer } from 'node:http';
import next from 'next';

const port = process.env.PORT || 8080;
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`Starting server on ${hostname}:${port}`);
console.log('Environment variables:', {
  PORT: process.env.PORT,
  HOSTNAME: process.env.HOSTNAME,
  NODE_ENV: process.env.NODE_ENV,
});

const app = next({
  dev: false,
  hostname,
  port,
  dir: '.',
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    server.listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  })
  .catch((ex) => {
    console.error('Error starting server:', ex);
    process.exit(1);
  });
