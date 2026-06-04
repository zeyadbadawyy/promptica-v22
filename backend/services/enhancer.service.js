function enhancePrompt(prompt, category, intent) {
  const base = prompt;

  // SOFTWARE + LEARNING
  if (category === "software" && intent === "learning") {
    return `
Act as a senior software engineer and instructor.

Goal:
Teach and guide the user step-by-step.

User Request:
${base}

Requirements:
- Break down concepts clearly
- Provide real-world examples
- Include a learning path
- Add beginner mistakes to avoid
- Suggest a mini project
`;
  }

  // SOFTWARE + BUILDING
  if (category === "software" && intent === "building") {
    return `
Act as a senior full-stack architect.

Goal:
Help design and build a production-ready system.

User Request:
${base}

Requirements:
- Define architecture
- Suggest tech stack
- Provide folder structure
- Include API design
- Consider scalability
`;
  }

  // SOFTWARE + DEBUGGING
  if (category === "software" && intent === "debugging") {
    return `
Act as a senior software debugger.

Goal:
Identify and fix issues step-by-step.

User Request:
${base}

Requirements:
- Identify possible root causes
- Suggest debugging steps
- Provide corrected code examples
- Explain why the issue happens
`;
  }

  // DEFAULT
  return `
Improve and clarify the following request:

${base}
`;
}

module.exports = { enhancePrompt };