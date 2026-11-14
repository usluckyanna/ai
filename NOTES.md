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
- The AI request is made only after the user presses **Explain this message**. The AI instruction section from `BRIEF.md` is sent as the system instruction for every request.
- Added browser storage for fictional sample data and the last message.
- Added a dark mode toggle for easier night browsing; the choice is saved in this browser.
- 目前仅保存在此计算机上。
- Current model setting: `gpt-4o-mini`.

## Next steps

- Replace the placeholder in `.env` with a real key and test one fictional example.
- Try the short video demo: choose “Homework instructions,” click “Explain this message,” and show the organized response.
- Ask a teacher or student to test whether the explanation is clear, then record feedback for the written entry.

## 以后再说

- Add language selection and a side-by-side original/translation view.
- Add teacher-approved source links and a way to flag a confusing answer.
- Improve privacy controls before any real school deployment.
- Prepare the PDF entry and final video before the challenge deadlines.
