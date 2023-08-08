// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginWithUI', (user) => {
  cy.session([user.company, user.username], () => {
    cy.intercept({
      method: 'POST',
      url: 'login/index/param'
    }).as('login')

    cy.visit('/login')
    
    cy.get('#dept_input')
    .type(user.company).
    should('have.value', user.company)
  
    cy.get('#username_input')
    .type(user.username).
    should('have.value', user.username)
  
    cy.get('#password-input')
    .type(user.password).
    should('have.value', user.password)

    cy.get('#login-button')
    .click()

    cy.wait('@login').then(({request, response}) => {
      cy.location().should((location) => {
        expect(location.pathname).to.eq('/home')
      })
    })
  })
})

Cypress.Commands.add('loginByCSRF', (user) => {
  cy.session([user.company, user.username], () => {
    cy.request('/login')
    .its('body')
    .then((body) => {
      // we can use Cypress.$ to parse the string body
      // thus enabling us to query into it easily
      const $html = Cypress.$(body)
      const csrf = $html.find('input[name=_csrf]').val()

      cy.request({
        url: '/login/index/param',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrf
        },
        body: new URLSearchParams({
          'inputCompany': user.company,
          'inputID': user.username,
          'inputPassword': user.password
        }).toString(),
      }).then((response) => {
          cy.visit('/home')
      })
    })
  })
})