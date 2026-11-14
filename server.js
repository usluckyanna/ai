const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const MODEL = 'gpt-4o-mini';

function readEnvKey() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return '';
  const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find((item) => item.startsWith('OPENAI_API_KEY='));
  if (!line) return '';
  return line.slice('OPENAI_API_KEY='.length).trim();
}

function readSystemInstructions() {
  const brief = fs.readFileSync(path.join(ROOT, 'BRIEF.md'), 'utf8');
  const match = brief.match(/## AI instructions[\s\S]*$/i);
  return match ? match[0] : 'Explain and organize teacher messages in simple language. Never invent missing information.';
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function serveFile(req, res) {
  const requested = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const safePath = path.normalize(requested).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(ROOT, 'public', safePath);
  if (!filePath.startsWith(path.join(ROOT, 'public'))) return json(res, 403, { error: 'Forbidden' });
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return json(res, 404, { error: 'Not found' });
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
  res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

async function askAI(req, res) {
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; if (raw.length > 20000) req.destroy(); });
  req.on('end', async () => {
    try {
      const { message } = JSON.parse(raw || '{}');
      if (!message || typeof message !== 'string' || !message.trim()) return json(res, 400, { error: 'Please enter a school message.' });
      const key = readEnvKey();
      if (!key || key === 'paste-your-key-here') return json(res, 503, { error: 'Please check the OpenAI key in your .env file.' });
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: MODEL, temperature: 0.2, messages: [
          { role: 'system', content: readSystemInstructions() },
          { role: 'user', content: message.trim() },
        ] }),
      });
      if (!response.ok) return json(res, 502, { error: 'The AI could not reply. Please check the key and your internet connection.' });
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (!answer) return json(res, 502, { error: 'The AI returned no answer. Please try again.' });
      return json(res, 200, { answer, model: MODEL });
    } catch (error) {
      return json(res, 502, { error: 'The AI could not reply. Please check the key and your internet connection.' });
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/ask') return askAI(req, res);
  if (req.method === 'GET') return serveFile(req, res);
  return json(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, () => console.log(`AI app running at http://localhost:${PORT}`));
