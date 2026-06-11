function mergeResults(
  scoreResult,
  feedback,
  strategyOutput,
  aiReview
) {
  let finalScore = scoreResult.score;

  if (
    aiReview &&
    typeof aiReview.score === "number"
  ) {
    finalScore = Math.round(
      scoreResult.score * 0.7 +
      aiReview.score * 0.3
    );
  }

  const finalFeedback = [...feedback];

  if (aiReview?.suggestions?.length) {
    aiReview.suggestions.forEach((item) => {
      if (!finalFeedback.includes(item)) {
        finalFeedback.push(item);
      }
    });
  }

  let finalImproved = strategyOutput;

  if (aiReview?.improvedPrompt) {
    finalImproved = {
      ...strategyOutput,

      content: [
        aiReview.improvedPrompt,
        ...(strategyOutput.content || [])
      ]
    };
  }

  return {
    score: finalScore,
    feedback: finalFeedback,
    improved: finalImproved
  };
}

module.exports = {
  mergeResults
};