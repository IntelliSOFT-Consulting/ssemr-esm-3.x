const rootConfig = require("../../jest.config.js");

module.exports = rootConfig;

module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setup-tests.ts"],
};
