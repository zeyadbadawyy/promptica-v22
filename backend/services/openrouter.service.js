const axios = require("axios");

async function enhancePrompt(
  originalPrompt,
  strategyPrompt,
  analysis
) {
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

Your job is to transform weak prompts into professional high-quality prompts.

Rules:

- Return ONLY the final improved prompt.
- Do not explain your reasoning.
- Do not include scores.
- Do not include strengths.
- Do not include weaknesses.
- Do not include suggestions.
- Make the prompt detailed, structured, and actionable.
- Preserve the user's original goal.
`
          },

          {
            role: "user",
            content: `
Original Prompt:
${originalPrompt}

Category:
${analysis.category}

Intents:
${analysis.intents.join(", ")}

Generated Strategy:
${strategyPrompt}

Create the best possible improved version of this prompt.
`
          }
        ],

        temperature: 0.8,
        max_tokens: 1200
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

    return (
      response.data?.choices?.[0]?.message?.content ||
      "Unable to generate enhanced prompt."
    );

  } catch (error) {
    console.error("OPENROUTER ERROR:");

    if (error.response) {
      console.error(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error(error.message);
    }

    return "Unable to generate enhanced prompt.";
  }
}

module.exports = {
  enhancePrompt
};