const educationLearning = require("./strategies/education.learning");
const softwareLearning = require("./strategies/software.learning");
const softwareBuilding = require("./strategies/software.building");
const softwareDebugging = require("./strategies/software.debugging");

function runStrategy(category, intents, prompt) {
  const sections = [];

  // SOFTWARE
  if (category === "software") {
    if (intents.includes("learning")) {
      sections.push(softwareLearning(prompt));
    }

    if (intents.includes("building")) {
      sections.push(softwareBuilding(prompt));
    }

    if (intents.includes("debugging")) {
      sections.push(softwareDebugging(prompt));
    }
  }

  // EDUCATION
  if (category === "education") {
    if (intents.includes("learning")) {
      sections.push(educationLearning(prompt));
    }
  }

  if (sections.length === 0) {
    return `Improve this prompt:\n\n${prompt}`;
  }

  return sections.join("\n\n====================================\n\n");
}

module.exports = { runStrategy };