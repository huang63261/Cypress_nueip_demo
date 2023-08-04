describe('attendance record testing - Admin', () => {
  context('出勤紀錄測試案例', () => {
      beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users').then((users) => {
        cy.loginWithUI(users.admin)
      })
    })

    it('新增後修改再刪除', () => {
      cy.visit('/attendance_record')

      cy.location().then((location) => {
        expect(location.pathname).to.be.eq('/attendance_record')
      })

      // cy.intercept(
      //   {
      //     method: "POST",
      //     path: "/shared/org_cascade_select_ajax"
      //   }
      // ).as('recordAdd')

      // cy.get('#sys_add')
      // .click()

      // cy.wait('@recordAdd').then(({request, response}) => {
      //   cy.get('[data-id="SLayer2"]')
      //   .should('be.visible')
      //   .click()
      // })
    })
  })
})