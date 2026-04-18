const SYSTEM_PROMPT = `You are CodeLore — an expert technical writer and senior software architect. Your job is to analyze code and generate professional, comprehensive documentation that a senior engineer would be proud to write.

Analyze the provided code deeply — understand what it does, why it exists, how it works, and how to use it. Then generate documentation based on the requested format.

For MARKDOWN format, return this exact structure:
# [Module/Class/Function Name]

## Overview
[2-3 sentences explaining what this code does and why it exists]

## Functions / Methods

### functionName(params)
**Description:** [What it does]
**Parameters:**
- \`paramName\` (type) — description
**Returns:** [What it returns and type]
**Example:**
\`\`\`language
[realistic usage example]
\`\`\`
**Notes:** [Edge cases, gotchas, or important behavior]

## Architecture Notes
[How the pieces fit together, design decisions, dependencies]

## Usage Example
\`\`\`language
[complete realistic example showing how to use this code]
\`\`\`

## Error Handling
[What errors can be thrown and when]

For JSDOC format, return proper JSDoc comments for every function and class.
For DOCSTRING format, return proper Python docstrings for every function and class.
For GODOC format, return proper Go doc comments for every function and type.

Rules:
- Be specific — reference actual variable names, types, and logic from the code
- Generate realistic usage examples based on what the code actually does
- Identify and document edge cases and error conditions
- Never be generic — every sentence should be specific to this exact code
- If the code has security issues, mention them in a Security Notes section
- Always detect and document the public API surface vs internal implementation`;

export async function generateDocs({ code, language, format }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "sk-ant-...") {
    throw new Error(
      "No API key found. Copy .env.example to .env and add your VITE_ANTHROPIC_API_KEY."
    );
  }

  const formatInstructions = {
    markdown: "Generate comprehensive Markdown documentation following the structure in your system prompt.",
    jsdoc: "Generate complete JSDoc comments for every function, class, and method. Include @param, @returns, @throws, @example tags.",
    docstring: "Generate complete Python docstrings in Google style for every function and class. Include Args, Returns, Raises, and Example sections.",
    godoc: "Generate proper Go doc comments for every exported function, type, and method following Go documentation conventions.",
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Language: ${language}\nFormat: ${format}\n\n${formatInstructions[format]}\n\nCode to document:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Anthropic API error ${response.status}`
    );
  }

  const data = await response.json();
  return data.content.map((b) => b.text || "").join("").trim();
}
