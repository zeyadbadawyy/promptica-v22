function scorePrompt(prompt) {
  const text = prompt.toLowerCase();

  let score = 0;

  const missing = [];
  const suggestions = [];

  // LENGTH

  if (text.length >= 150) {
    score += 25;
  } else if (text.length >= 80) {
    score += 15;
  } else if (text.length >= 40) {
    score += 8;
  } else {
    missing.push("details");
    suggestions.push("Add more context and details");
  }

  // CLEAR GOAL

  if (
    text.includes("build") ||
    text.includes("create") ||
    text.includes("make") ||
    text.includes("learn") ||
    text.includes("teach") ||
    text.includes("understand") ||
    text.includes("debug") ||
    text.includes("fix")
  ) {
    score += 15;
  } else {
    missing.push("goal");
    suggestions.push("Clearly state your objective");
  }

  // TECHNOLOGY

  if (
    text.includes("react") ||
    text.includes("node") ||
    text.includes("express") ||
    text.includes("api") ||
    text.includes("python") ||
    text.includes("javascript") ||
    text.includes("database")
  ) {
    score += 15;
  } else {
    missing.push("technology");
    suggestions.push(
      "Mention technologies or domain context"
    );
  }

  // EXPECTED OUTPUT

  if (
    text.includes("step by step") ||
    text.includes("roadmap") ||
    text.includes("guide") ||
    text.includes("plan")
  ) {
    score += 20;
  } else {
    missing.push("expected output");
    suggestions.push(
      "Specify the type of response you expect"
    );
  }

  // CONSTRAINTS

  if (
    text.includes("beginner") ||
    text.includes("advanced") ||
    text.includes("simple") ||
    text.includes("production") ||
    text.includes("scalable")
  ) {
    score += 15;
  } else {
    missing.push("constraints");
    suggestions.push(
      "Add constraints, experience level, or requirements"
    );
  }

  // BONUS FOR VERY DETAILED PROMPTS

  if (text.length >= 250) {
    score += 10;
  }

  score = Math.min(score, 100);

  return {
    score,
    missing,
    suggestions
  };
}

module.exports = {
  scorePrompt
};