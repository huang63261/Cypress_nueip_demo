const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'wq8633',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://harvey-autotest.rd1.nueip.site/'
  },
});
