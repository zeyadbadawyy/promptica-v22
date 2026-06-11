var express = require("express");
var router = express.Router();

const { classifyPrompt } = require("../services/classifier.service");
const { detectIntent } = require("../services/intent.service");
const { runStrategy } = require("../services/strategy.engine");
const { scorePrompt } = require("../services/scoring.service");
const { generateFeedback } = require("../services/feedback.service");
const { reviewPrompt } = require("../services/openrouter.service");
const { mergeResults } = require("../services/merge.service");

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

    let aiReview = null;

    try {
      aiReview = await reviewPrompt(prompt, {
        category: classification.category,
        intents: normalizedIntents
      });
      console.log(
      "AI REVIEW RAW:",
      JSON.stringify(aiReview, null, 2)
);
    } catch (err) {
      console.error(
        "AI REVIEW ERROR:",
        err.message
      );
    }

    const merged = mergeResults(
      scoreResult,
      feedback,
      strategyOutput,
      aiReview
    );

    console.log({
      category: classification.category,
      intents: normalizedIntents,
      localScore: scoreResult.score,
      aiScore: aiReview?.score,
      finalScore: merged.score
    });

    res.json({
      original: prompt,

      analysis: {
        category: classification.category,
        intents: normalizedIntents,
        score: merged.score,
        missing: scoreResult.missing,
        classificationScores:
          classification.scores
      },

      feedback: merged.feedback,

      improved: merged.improved
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;