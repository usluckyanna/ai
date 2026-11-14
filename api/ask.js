const fs = require('fs');
const path = require('path');

const MODEL = 'gpt-4o-mini';

function readLocalInstructions() {
  try {
    const brief = fs.readFileSync(path.join(process.cwd(), 'BRIEF.md'), 'utf8');
    const match = brief.match(/## AI instructions[\s\S]*$/i);
    return match ? match[0] : 'Explain and organize teacher messages in simple language. Never invent missing information.';
  } catch {
    return 'Explain and organize teacher messages in simple language. Never invent missing information.';
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured.' });

  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) return res.status(400).json({ error: 'Please enter a question.' });
    if (message.length > 12000) return res.status(413).json({ error: 'Please keep the question under 12,000 characters.' });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, temperature: 0.2, messages: [
        { role: 'system', content: readLocalInstructions() },
        { role: 'user', content: message },
      ] }),
    });
    if (!response.ok) return res.status(502).json({ error: 'The AI could not reply. Check the key and try again.' });
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;
    if (!answer) return res.status(502).json({ error: 'The AI returned no answer.' });
    return res.status(200).json({ answer, model: MODEL });
  } catch {
    return res.status(502).json({ error: 'The AI could not reply. Check the key and your connection.' });
  }
};
