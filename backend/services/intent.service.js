function detectIntent(prompt) {
  const text = prompt.toLowerCase();

  const intents = [];

  // LEARNING
  if (
    text.includes("learn") ||
    text.includes("teach") ||
    text.includes("study") ||
    text.includes("understand")
  ) {
    intents.push("learning");
  }

  // BUILDING
  if (
    text.includes("build") ||
    text.includes("create") ||
    text.includes("make") ||
    text.includes("develop")
  ) {
    intents.push("building");
  }

  // DEBUGGING
  if (
    text.includes("debug") ||
    text.includes("fix") ||
    text.includes("error") ||
    text.includes("issue")
  ) {
    intents.push("debugging");
  }

  // PLANNING
  if (
    text.includes("plan") ||
    text.includes("strategy") ||
    text.includes("design")
  ) {
    intents.push("planning");
  }

  if (intents.length === 0) {
    intents.push("general");
  }

  return {
    intents
  };
}

module.exports = { detectIntent };