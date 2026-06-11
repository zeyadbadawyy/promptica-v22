function educationLearning(prompt) {
  return `
Act as an expert teacher.

Student Request:
${prompt}

Provide:
- Key concepts
- Simple explanation
- Step-by-step learning path
- Common mistakes
- Recommended resources
`;
}

module.exports = educationLearning;