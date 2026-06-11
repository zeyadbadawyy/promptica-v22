const axios = require("axios");

function parseAIReview(text) {
  const result = {
    score: null,
    strengths: [],
    weaknesses: [],
    suggestions: [],
    improvedPrompt: ""
  };

  const scoreMatch = text.match(
    /PROMPT SCORE:\s*(\d+)/i
  );

  if (scoreMatch) {
    result.score = Number(scoreMatch[1]);
  }

  const strengthsMatch = text.match(
    /STRENGTHS:([\s\S]*?)WEAKNESSES:/i
  );

  const weaknessesMatch = text.match(
    /WEAKNESSES:([\s\S]*?)SUGGESTIONS:/i
  );

  const suggestionsMatch = text.match(
    /SUGGESTIONS:([\s\S]*?)IMPROVED PROMPT:/i
  );

  const improvedPromptMatch = text.match(
    /IMPROVED PROMPT:([\s\S]*)/i
  );

  if (strengthsMatch) {
    result.strengths = strengthsMatch[1]
      .split("\n")
      .map(line => line.replace("-", "").trim())
      .filter(Boolean);
  }

  if (weaknessesMatch) {
    result.weaknesses = weaknessesMatch[1]
      .split("\n")
      .map(line => line.replace("-", "").trim())
      .filter(Boolean);
  }

  if (suggestionsMatch) {
    result.suggestions = suggestionsMatch[1]
      .split("\n")
      .map(line => line.replace("-", "").trim())
      .filter(Boolean);
  }

  if (improvedPromptMatch) {
    result.improvedPrompt =
      improvedPromptMatch[1].trim();
  }

  return result;
}

async function reviewPrompt(prompt, analysis) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "poolside/laguna-xs.2:free",

        messages: [
          {
            role: "system",
            content: `
You are Promptica AI.

Always respond using EXACTLY:

PROMPT SCORE: [number]

STRENGTHS:
- item

WEAKNESSES:
- item

SUGGESTIONS:
- item

IMPROVED PROMPT:
[text]
`
          },
          {
            role: "user",
            content: `
User Prompt:
${prompt}

Category:
${analysis.category}

Intents:
${analysis.intents.join(", ")}

Review this prompt.
`
          }
        ],

        temperature: 0.7,
        max_tokens: 800
      },
      {
        timeout: 60000,
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Promptica"
        }
      }
    );

    const content =
      response.data?.choices?.[0]?.message?.content;

    if (!content) {
      return {
        error: "No AI review returned."
      };
    }

    return parseAIReview(content);

  } catch (error) {
    console.error("OPENROUTER ERROR:");

    if (error.response) {
      console.error(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error(error.message);
    }

    return {
      error: "OpenRouter request failed."
    };
  }
}

module.exports = {
  reviewPrompt
};