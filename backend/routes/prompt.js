var express = require("express");
var router = express.Router();

const { classifyPrompt } = require("../services/classifier.service");
const { detectIntent } = require("../services/intent.service");
const { runStrategy } = require("../services/strategy.engine");
const { scorePrompt } = require("../services/scoring.service");
const { generateFeedback } = require("../services/feedback.service");
const { enhancePrompt } = require("../services/openrouter.service");

router.post("/improve", async function (req, res) {
  const prompt = req.body?.prompt;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required"
    });
  }

  try {
    const classification = classifyPrompt(prompt);

    const intentData = detectIntent(prompt);

    const normalizedIntents = Array.isArray(intentData.intents)
      ? intentData.intents
      : [intentData.intents];

    const scoreResult = scorePrompt(prompt);

    const feedback = generateFeedback(
      prompt,
      scoreResult
    );

    const strategyOutput = runStrategy(
      classification.category,
      normalizedIntents,
      prompt
    );

    let finalPrompt = "";

    try {
      finalPrompt = await enhancePrompt(
        prompt,
        strategyOutput.content.join("\n\n"),
        {
          category: classification.category,
          intents: normalizedIntents
        }
      );
    } catch (err) {
      console.error(
        "AI ENHANCEMENT ERROR:",
        err.message
      );

      finalPrompt =
        strategyOutput.content.join("\n\n");
    }

    console.log({
      category: classification.category,
      intents: normalizedIntents,
      score: scoreResult.score
    });

    res.json({
      original: prompt,

      analysis: {
        category: classification.category,
        intents: normalizedIntents,
        score: scoreResult.score,
        missing: scoreResult.missing,
        classificationScores:
          classification.scores
      },

      feedback,

      improved: {
        text: finalPrompt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;