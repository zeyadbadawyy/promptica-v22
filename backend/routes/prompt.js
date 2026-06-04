var express = require("express");
var router = express.Router();

//const { enhancePrompt } = require("../services/enhancer.service");
const { classifyPrompt } = require("../services/classifier.service");
const { detectIntent } = require("../services/intent.service");
const { runStrategy } = require("../services/strategy.engine");
const { scorePrompt } = require("../services/scoring.service");
const { generateFeedback } = require("../services/feedback.service");

router.post("/improve", function (req, res) {
  const prompt = req.body?.prompt;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required"
    });
  }

  const classification = classifyPrompt(prompt);
  const intentData = detectIntent(prompt);
  const scoreResult = scorePrompt(prompt);
  const feedback = generateFeedback(prompt, scoreResult);
  const improved = runStrategy(
    classification.category,
    intentData.intents,
    prompt
  );

  console.log("CATEGORY:", classification.category);
  console.log("INTENTS:", intentData.intents);

  res.json({
    original: prompt,
    analysis: {
      category: classification.category,
      intents: intentData.intents,
      score: scoreResult.score,
      missing: scoreResult.missing,
      classificationScores: classification.scores
    },
    feedback,
    improved
  });
});

module.exports = router;