const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'wq8633',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://harvey-autotest.rd1.nueip.site/'
  },
  env: {
    develop: true,
    home_url: '/home',
    login_url: '/login',
    attendance_url: '/attendance_record',
    attendance_management_url: '/attendance_management',
    leave_application_url: {
      user: '/leave_application/personal_leave_application_user',
      manager: '/leave_application/personal_leave_application_manager'
    },
    salary_calculation_url: '/salary_calculation',
  },
});
