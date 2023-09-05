describe('Login - CSRF', () => {
  context('Login' ,() => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/admin').then((users) => {
        cy.loginByCSRF(users)
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