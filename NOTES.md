# Project notes

每次保存后，请将其推送到 GitHub。

## How to run

1. Put a real OpenAI API key in `.env` after `OPENAI_API_KEY=`. Never paste it into chat or the browser page.
2. In this folder, run the one command:

```text
node server.js
```

3. Open <http://localhost:3000> in a browser.

## Completed

- Built version 1 of **ai**, a small web app for translating, explaining, and organizing school messages.
- Added fictional examples for a field trip, homework, and a multilingual family notice.
- Added a clear difference from a basic translator: the AI is asked for meaning, action steps, dates, and questions to ask the teacher.
- Added a safety reminder, a check-with-your-teacher warning, a blocked double-click while the AI is thinking, and an error message for missing keys or network problems.
- Added a small server component in `server.js`; it reads the key only from `.env` and never sends the key to the page.
- The local server and Vercel function send an AI request only after the user presses **问问 AI**. The AI instruction section from `BRIEF.md` is sent as the system instruction for every request.
- Added browser storage for fictional sample data and the last message.
- Added a dark mode toggle for easier night browsing; the choice is saved in this browser.
- 目前仅保存在此计算机上。
- Current model setting: `gpt-4o-mini`.

## Next steps

- Replace the placeholder in `.env` with a real key and test one fictional example.
- Try the short video demo: choose “Homework instructions,” click “Explain this message,” and show the organized response.
- Ask a teacher or student to test whether the explanation is clear, then record feedback for the written entry.

## Vercel deployment

- This project uses Vercel's built-in Node.js function discovery: `api/ask.js` serves `POST /api/ask`, while the root `index.html` and `public/` assets are served as static files. No framework, build command, or extra library is required.
- Import the GitHub repository `usluckyanna/ai` into Vercel and keep the project root as the root directory. Leave the build command empty and deploy the project as-is.
- In Vercel Project Settings → Environment Variables, add `OPENAI_API_KEY` for the environments you use (Preview and/or Production). The deployed function reads only `process.env.OPENAI_API_KEY`; never upload `.env` or paste the key into code.
- For local testing, put the key in the ignored `.env` file as `OPENAI_API_KEY=...`, then run `node server.js` and open `http://localhost:3000`. The page's “问问 AI” control calls `/api/ask`.
- Vercel does not need any setting besides `OPENAI_API_KEY` for the AI function. The repository and the default Vercel Node.js runtime provide the rest.

## 以后再说

- Add language selection and a side-by-side original/translation view.
- Add teacher-approved source links and a way to flag a confusing answer.
- Improve privacy controls before any real school deployment.
- Prepare the PDF entry and final video before the challenge deadlines.
