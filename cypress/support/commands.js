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
  
    cy.intercept({
      method: 'POST',
      url: 'login/index/param'
    }).as('login')

    cy.get('#login-button')
    .click()

    cy.wait('@login').then(({request, response}) => {
      console.log(response)
      // expect(response)
    })
  
    // cy.location().should((location) => {
    //   expect(location.pathname).to.eq('/home')
    // })
  })
})