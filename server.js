require('dotenv').config();

const http = require('http');
const { sendTest } = require('./mail');

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

const host = process.env.HTTP_HOST || '127.0.0.1';
const port = Number(process.env.HTTP_PORT || 3000);

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/mail/test') {
    try {
      const body = await readJson(req);
      await sendTest(body);
      json(res, 200, { status: 'ok' });
    } catch (err) {
      console.error(err);
      json(res, 500, { error: err.message });
    }
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
