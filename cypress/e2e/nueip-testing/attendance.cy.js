describe('attendance', () => {
  context('test', () => {
      beforeEach(() => {
      cy.viewport(1280, 800)
      cy.loginWithUI({company: 'HHT', username: 'admin', password: 'test12345678'})
    })

    it('test1', () => {
      cy.visit('/home')
    })
  })
})