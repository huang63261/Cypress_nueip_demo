describe('Login - CSRF', () => {
  context('Login' ,() => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('nueipUsers').then((users) => {
        cy.loginByCSRF(users.admin)
      })
    })

    it('login test', () => {
      cy.visit('/home')
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/home')
      })
    })
  })
})