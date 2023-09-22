/// <reference types="cypress" />

describe('Login With UI', () => {
  context('Login' ,() => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/admin').then((users) => {
        cy.loginWithUI(users)
      })
    })

    it('login test', () => {
      cy.visit(Cypress.env('home_url'))
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/home')
      })
    })
  })
})