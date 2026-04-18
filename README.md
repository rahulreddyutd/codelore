# CodeLore

I got tired of reading undocumented code.

Every codebase I have worked in has the same problem. Functions with no comments, classes with no explanation of what they do or why they exist, and a general understanding that documentation is something you write when you have time — which means it never gets written. Onboarding takes weeks instead of days because nobody can figure out what anything does without reading every line.

CodeLore is my answer to that. Paste any code, click Generate, and get professional documentation in seconds. The kind a senior engineer would write after really understanding the code — not generic boilerplate that restates what the function name already says.

---

## What it does

You paste code into the left panel — or upload a file directly — and CodeLore semantically analyzes it and generates structured documentation on the right. It understands what the code does, why it exists, how the pieces fit together, and what can go wrong.

Every generated document includes:

- An overview explaining what the code does and why it exists
- Every function and method documented with typed parameters, return values, and realistic usage examples
- Edge cases and gotchas the AI picks up from reading the logic
- Architecture notes explaining how the pieces fit together
- A complete usage example showing the code working end to end
- Error handling — every error the code can throw and when
- Security notes if the AI detects vulnerabilities in the code

You choose the output format based on your workflow. Markdown for README files and documentation sites. JSDoc for JavaScript and TypeScript codebases where you paste the output directly above your functions. Python Docstrings for Python code. Go Doc comments for Go packages. The language is auto-detected so you never have to set it manually.

---

## Getting started

You need Node 18+ and an Anthropic API key from console.anthropic.com.

    git clone https://github.com/rahulreddyutd/codelore.git
    cd codelore
    npm install
    cp .env.example .env

Open .env and add your key:

    VITE_ANTHROPIC_API_KEY=add_your_api_key_here

Start it:

    npm run dev

Open http://localhost:3002, paste any code, select your output format, and click Generate docs.

---

## File types you can upload

CodeLore accepts direct file uploads for .js, .jsx, .ts, .tsx, .py, .go, .java, .rs, .cpp, .php, .rb, and .sql files. Drop a file in and it reads it instantly, auto-detects the language, and is ready to generate.

---

## Project layout
codelore/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── claude.js              Claude API integration and prompt engineering
│   ├── components/
│   │   ├── TopBar.jsx             header
│   │   ├── CodePanel.jsx          code editor, language selector, format picker
│   │   └── DocPanel.jsx           rendered documentation output with copy and download
│   ├── utils/
│   │   └── language.js            language detection, format definitions, sample code
│   ├── App.jsx                    root component and state management
│   ├── main.jsx                   React entry point
│   └── index.css                  dark design system with orange accent
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── .gitignore

---

## How the documentation engine works

The core of CodeLore is the system prompt in src/api/claude.js. It instructs Claude to analyze code semantically — meaning it reads the logic, infers intent, traces data flow, and identifies edge cases — rather than just describing what each line does syntactically.

The prompt enforces a strict documentation structure so output is always consistent regardless of what code goes in. Function names, parameter types, return values, error conditions, and usage examples are all required sections. The model is told to be specific — referencing actual variable names and logic from the submitted code — which prevents the generic output that most AI documentation tools produce.

Format selection changes the output structure entirely. Markdown produces a full document with headers, code blocks, and sections. JSDoc produces comment blocks you paste directly above functions. Docstring and Go Doc produce inline comments following each language's official documentation conventions.

---

## Output formats explained

**Markdown** — Best for README files, documentation sites like Docusaurus or GitBook, Notion pages, and Confluence. Works anywhere that renders Markdown which is essentially everywhere.

**JSDoc** — Best for JavaScript and TypeScript developers. Paste the output directly above your functions and classes in your editor. VS Code and other IDEs pick it up automatically and show docs on hover.

**Python Docstring** — Google-style docstrings for Python code. Paste inside your functions and tools like Sphinx can generate full documentation sites from them automatically.

**Go Doc** — Standard Go documentation comments for exported functions and types. Follows Go's official documentation conventions so godoc and pkg.go.dev render them correctly.

---

## Deploying

The quickest path to a live URL is Vercel:

1. Push to GitHub
2. Go to vercel.com and import the repo
3. Add VITE_ANTHROPIC_API_KEY under Environment Variables
4. Deploy

Same note as always — the API key is in the client bundle which is fine for personal use and internal tools. For anything public, move the API call to a backend endpoint and call that from the frontend instead.

---

## What I would build next

The current implementation generates documentation for whatever code you paste in one session. A production version would connect directly to a GitHub repository, scan the entire codebase, identify every undocumented function, and generate documentation for all of them in batch — then open a pull request with the changes so the team can review before merging.

Other things on the list: a VS Code extension so you can generate docs inline without leaving your editor, a diff mode that detects when code has changed and flags documentation that is now out of date, and support for generating documentation in multiple languages for international engineering teams.

---

## License

MIT — use it however you want.
