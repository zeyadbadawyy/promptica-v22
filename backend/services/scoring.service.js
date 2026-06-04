function scorePrompt(prompt) {
  const text = prompt.toLowerCase();

  let score = 50;
  const missing = [];
  const suggestions = [];

  if (text.length < 20) {
    score -= 20;
    missing.push("clarity");
    suggestions.push("Add more detail");
  }

  if (!text.includes("react") &&
      !text.includes("node") &&
      !text.includes("api")) {
    score -= 15;
    missing.push("tech stack");
    suggestions.push("Specify technologies");
  }

  if (!text.includes("build") &&
      !text.includes("create") &&
      !text.includes("make")) {
    score -= 10;
    missing.push("objective");
    suggestions.push("Define what you're building");
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

 return {
  score,
  missing,
  suggestions
};
}

module.exports = { scorePrompt };