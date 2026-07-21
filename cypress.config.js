const { defineConfig } = require('cypress')
const { plugin } = require('@cypress/grep/plugin')

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      return plugin(config)
    },
  },
})