module.exports = function (prompt) {
  return `
Act as a system architect.

User Request:
${prompt}

Provide:
- Architecture design
- Tech stack
- API structure
- Folder structure
- Scalability considerations
`;
};