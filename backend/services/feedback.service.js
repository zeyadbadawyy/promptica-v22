function generateFeedback(prompt, scoreResult) {
  const feedback = [];

  if (scoreResult.missing.includes("details")) {
    feedback.push("Add more context and details to improve prompt quality.");
  }

  if (scoreResult.missing.includes("goal")) {
    feedback.push("Clearly state what you want to achieve.");
  }

  if (scoreResult.missing.includes("technology")) {
    feedback.push("Mention technologies, tools, or the domain involved.");
  }

  if (scoreResult.missing.includes("expected output")) {
    feedback.push("Specify the type of response you expect (guide, roadmap, code, explanation, etc).");
  }

  // Score-based feedback
  if (scoreResult.score >= 85) {
    feedback.push("Excellent prompt structure.");
  } else if (scoreResult.score >= 70) {
    feedback.push("Good prompt with room for refinement.");
  } else if (scoreResult.score >= 50) {
    feedback.push("Average prompt. Adding more specificity would help.");
  } else {
    feedback.push("Prompt needs more context and structure.");
  }

  return feedback;
}

module.exports = { generateFeedback };