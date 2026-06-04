function generateFeedback(prompt, scoreResult) {
  const feedback = [];

  if (scoreResult.missing.includes("clarity")) {
    feedback.push("Your request is too vague. Add more details.");
  }

  if (scoreResult.missing.includes("tech stack")) {
    feedback.push("You should specify technologies (React, Node.js, etc).");
  }

  if (scoreResult.missing.includes("clear objective")) {
    feedback.push("Define exactly what you want to build or achieve.");
  }

  if (feedback.length === 0) {
    feedback.push("Your prompt is already well structured.");
  }

  return feedback;
}

module.exports = { generateFeedback };