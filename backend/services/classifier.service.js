function classifyPrompt(prompt) {
  const text = prompt.toLowerCase();

  const scores = {
    software: 0,
    education: 0,
    marketing: 0,
    general: 1
  };

  // SOFTWARE SIGNALS
  const softwareKeywords = [
    "react", "node", "express", "api", "backend", "frontend",
    "website", "app", "code", "database", "bug", "debug"
  ];

  softwareKeywords.forEach(word => {
    if (text.includes(word)) scores.software += 2;
  });

  // EDUCATION SIGNALS
  const educationKeywords = [
    "learn", "teach", "explain", "understand", "study", "tutorial"
  ];

  educationKeywords.forEach(word => {
    if (text.includes(word)) scores.education += 2;
  });

  // MARKETING SIGNALS
  const marketingKeywords = [
    "marketing", "ads", "campaign", "audience", "brand", "seo"
  ];

  marketingKeywords.forEach(word => {
    if (text.includes(word)) scores.marketing += 2;
  });

  // pick highest score
  const best = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  return {
    category: best,
    scores
  };
}

module.exports = { classifyPrompt };