function detectIntent(prompt) {
  const text = prompt.toLowerCase();

  const intents = [];

  // LEARNING
  if (
    text.includes("learn") ||
    text.includes("teach") ||
    text.includes("study") ||
    text.includes("understand") ||
    text.includes("explain") ||
    text.includes("tutorial")
  ) {
    intents.push("learning");
  }

  // BUILDING
  if (
    text.includes("build") ||
    text.includes("create") ||
    text.includes("make") ||
    text.includes("develop") ||
    text.includes("website") ||
    text.includes("app") ||
    text.includes("dashboard")
  ) {
    intents.push("building");
  }

  // DEBUGGING
  if (
    text.includes("debug") ||
    text.includes("fix") ||
    text.includes("error") ||
    text.includes("issue") ||
    text.includes("bug")
  ) {
    intents.push("debugging");
  }

  // PLANNING
  if (
    text.includes("plan") ||
    text.includes("strategy") ||
    text.includes("design") ||
    text.includes("architecture")
  ) {
    intents.push("planning");
  }

  if (intents.length === 0) {
    intents.push("general");
  }

  return {
    intents: [...new Set(intents)]
  };
}

module.exports = { detectIntent };