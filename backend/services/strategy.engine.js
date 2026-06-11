const educationLearning = require("./strategies/education.learning");
const softwareLearning = require("./strategies/software.learning");
const softwareBuilding = require("./strategies/software.building");
const softwareDebugging = require("./strategies/software.debugging");

function runStrategy(category, intents, prompt) {
  const sections = [];

  const hasLearning = intents.includes("learning");
  const hasBuilding = intents.includes("building");
  const hasDebugging = intents.includes("debugging");

  // DEFAULT BEHAVIOR (important fix)
  const safeIntents = intents.length ? intents : ["building"];

  if (category === "software") {

    // PRIORITY ORDER (important)
    if (hasDebugging) {
      sections.push(softwareDebugging(prompt));
    }

    if (hasBuilding) {
      sections.push(softwareBuilding(prompt));
    }

    if (hasLearning) {
      sections.push(softwareLearning(prompt));
    }

    // fallback if nothing matched
    if (!sections.length) {
      sections.push(softwareBuilding(prompt));
    }
  }

  if (category === "education") {
    if (hasLearning) {
      sections.push(educationLearning(prompt));
    } else {
      sections.push(educationLearning(prompt));
    }
  }

  return {
  type: "strategy_output",
  category,
  intents,
  content: sections
};

}

module.exports = { runStrategy };