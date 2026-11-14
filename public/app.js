const examples = {
  'field-trip': 'Reminder: Our class visits the City Science Museum on Thursday, October 15. Please return the permission form by Monday. Bring a packed lunch and wear comfortable shoes. Meet in Room 204 at 8:15 AM.',
  homework: 'Homework: Read pages 42–48. Write three questions about the main character and bring your notes to class on Friday. You may use the vocabulary list, but write the answers in your own words.',
  multilingual: 'Families: Please review the attached progress update before our family meeting next week. If you need an interpreter or have questions about the schedule, contact the school office.',
};

const message = document.querySelector('#message');
const select = document.querySelector('#exampleSelect');
const button = document.querySelector('#sendButton');
const status = document.querySelector('#status');
const answer = document.querySelector('#answer');
const themeToggle = document.querySelector('#themeToggle');
const STORAGE_KEY = 'ai-project-data-v1';

const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
if (saved.lastMessage) message.value = saved.lastMessage;
if (saved.darkMode) document.body.classList.add('dark-mode');
const updateThemeButton = () => {
  const dark = document.body.classList.contains('dark-mode');
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'Turn off dark mode' : 'Turn on dark mode');
  themeToggle.querySelector('span').textContent = dark ? 'Light mode' : 'Dark mode';
};
updateThemeButton();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, darkMode: document.body.classList.contains('dark-mode') }));
  updateThemeButton();
});
select.addEventListener('change', () => { if (examples[select.value]) message.value = examples[select.value]; });

button.addEventListener('click', async () => {
  const text = message.value.trim();
  if (!text) { status.textContent = 'Paste a message first.'; status.className = 'status error'; return; }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastMessage: text, lastUsedAt: new Date().toISOString() }));
  button.disabled = true;
  status.textContent = 'Thinking…';
  status.className = 'status thinking';
  answer.textContent = '';
  try {
    const response = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The AI could not reply.');
    status.textContent = 'Ready — check the original notice too.';
    status.className = 'status';
    answer.textContent = data.answer;
  } catch (error) {
    status.textContent = error.message.includes('key') ? 'Please check the OpenAI key in your .env file.' : 'The AI could not reply. Please check the key and your internet connection.';
    status.className = 'status error';
  } finally { button.disabled = false; }
});
