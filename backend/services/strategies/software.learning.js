module.exports = function (prompt) {
  return `
Act as a senior software engineer and instructor.

User Request:
${prompt}

Break it down into:
1. Concept explanation
2. Step-by-step guide
3. Real example
4. Practice task
`;
};