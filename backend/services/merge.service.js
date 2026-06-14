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

  let mergedPrompt = "";

  if (aiReview?.improvedPrompt) {
    mergedPrompt += aiReview.improvedPrompt;
  }

  if (
    strategyOutput?.content &&
    strategyOutput.content.length > 0
  ) {
    mergedPrompt +=
      "\n\n---\n\nAdditional Guidance:\n\n" +
      strategyOutput.content.join("\n\n");
  }

  return {
    score: finalScore,
    feedback: finalFeedback.slice(0, 5),

    improved: {
      text: mergedPrompt
    }
  };
}

module.exports = {
  mergeResults
};