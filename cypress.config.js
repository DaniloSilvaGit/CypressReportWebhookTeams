const { defineConfig } = require('cypress')
const { plugin } = require('@cypress/grep/plugin')

module.exports = defineConfig({
  allowCypressEnv: false,
  projectId: '81hcng',
  numTestsKeptInMemory: 1,
  defaultCommandTimeout: 16000,
  requestTimeout: 16000,
  responseTimeout: 16000,


  e2e: {
    setupNodeEvents(on, config) {
      return plugin(config)
    },
    env: {
      hideCredentials: true,
      //requestMode:false,
    },
    //reporter: 'mochawesome',
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
    "viewportWidth": 1920,
    "viewportHeight": 1080,
    "chromeWebSecurity": false,
    testIsolation: false,
    video: true

  },
})