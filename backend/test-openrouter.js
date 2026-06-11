require("dotenv").config();

const {
  reviewPrompt
} = require("./services/openrouter.service");

(async () => {
  try {
    console.log("TEST STARTED");

    const result = await reviewPrompt(
      "I want to build a React dashboard",
      {
        category: "software",
        intents: ["building"]
      }
    );

    console.log("RESULT:");
    console.log(result);

    console.log("TEST FINISHED");
  } catch (err) {
    console.error("TEST ERROR:");
    console.error(err);
  }
})();