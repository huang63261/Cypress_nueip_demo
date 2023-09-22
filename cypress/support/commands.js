/// <reference types="cypress" />

Cypress.Commands.add('loginWithUI', (user) => {
  cy.session([user.company, user.username], () => {
    cy.intercept({
      method: 'POST',
      url: Cypress.env('login_url') + '/index/param'
    }).as('login')

    cy.visit(Cypress.env('login_url'))

    cy.get('#dept_input')
      .type(user.company)
      .should('have.value', user.company)

    cy.get('#username_input')
      .type(user.username)
      .should('have.value', user.username)

    cy.get('#password-input')
      .type(user.password)
      .should('have.value', user.password)

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
        url: Cypress.env('login_url') + '/index/param',
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
          cy.location().should((location) => {
            expect(location.pathname).to.eq('/home')
          })
      })
    })
  })
})
