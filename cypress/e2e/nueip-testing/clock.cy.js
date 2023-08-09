describe('Clockin & out testing', () => {
  context('Login' ,() => {
    beforeEach(() => {
        cy.viewport(1280, 800)
        cy.fixture('nueipUsers').then((users) => {
        cy.loginByCSRF(users.admin)
      })
    })

    it('Stub', () => {
      cy.visit('/home')

      // Stubbing，塞入假物件response
      cy.fixture('clockinResponse').then((response) => {
        cy.intercept(
          {
            method: 'POST',
            path: '/time_clocks/ajax'
          },
          {
            statusCode: 400,
            body: response.thirtySecsFail,
            delay: 2000
          }).as('clockin')
      })

      // 點擊上班打卡
      cy.get('.desktopsite_right')
      .find('.clock_btn_block')
      .should('be.visible')
      .find('#clockin')
      .click()

      // 等待別名路由
      cy.wait('@clockin').then(({request, response}) => {
        expect(response.statusCode).to.eq(400)
        expect(response.body.status).to.eq('fail')
        expect(response.body.message).to.eq('30秒內請勿重複打卡')
      })
    })

    it('成功打上班卡', () => {
      cy.visit('/home')

      // 設定攔截器
      cy.intercept({
        method: 'POST',
        path: '/time_clocks/ajax'
      }).as('clockin')

      // 點擊上班打卡
      cy.get('.desktopsite_right')
      .find('.clock_btn_block')
      .should('be.visible')
      .find('#clockin')
      .click()

      // 等待別名路由
      cy.wait('@clockin').then(({request, response}) => {
        expect(response.body.status).to.eq('success')
        expect(response.body.message).to.eq('打卡成功')
      })
    })

    it('三/三十 秒內重複打上班卡', () => {
      cy.visit('/home')

      // 設定攔截器
      cy.intercept({
        method: 'POST',
        path: '/time_clocks/ajax'
      }).as('clockin')

      // 點擊上班打卡
      cy.get('.desktopsite_right')
      .find('.clock_btn_block')
      .should('be.visible')
      .find('#clockin')
      .click()

      // 等待別名路由
      cy.wait('@clockin').then(({request, response}) => {
        expect(response.body.status).to.eq('fail')
      })
    })
  })

})