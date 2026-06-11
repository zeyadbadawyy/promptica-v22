function classifyPrompt(prompt) {
  const text = prompt.toLowerCase();

  const scores = {
    software: 0,
    education: 0,
    marketing: 0
  };

  // SOFTWARE SIGNALS
  const softwareKeywords = [
    "react", "node", "express", "api", "backend", "frontend",
    "website", "app", "code", "database", "bug", "debug",
    "build", "create", "make", "dashboard", "system"
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

  // find best category
  const best = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  // safety fallback (IMPORTANT FIX)
  const category = scores[best] === 0 ? "software" : best;

  return {
    category,
    scores
  };
}

module.exports = { classifyPrompt };