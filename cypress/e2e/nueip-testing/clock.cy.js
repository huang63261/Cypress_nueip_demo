describe('Clockin & out', () => {
  context('Login' ,() => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.loginWithUI({company: 'HHT', username: 'admin', password: 'test12345678'})
    })

    it('successfully clockin', () => {
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

    it('clockin second time in 30s', () => {
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
        console.log(response)
        expect(response.body.status).to.eq('fail')
        expect(response.body.message).to.eq('請稍後再打卡')
      })
    })

    it('successfully clockout', () => {
      cy.visit('/home')

      // 設定攔截器
      cy.intercept({
        method: 'POST',
        path: '/time_clocks/ajax'
      }).as('clockout')

      // 點擊上班打卡
      cy.get('.desktopsite_right')
      .find('.clock_btn_block')
      .should('be.visible')
      .find('#clockout')
      .click()

      // 等待別名路由
      cy.wait('@clockout').then(({request, response}) => {
        console.log(response)
        expect(response.body.status).to.eq('success')
        expect(response.body.message).to.eq('打卡成功')
      })
    })

    it('clockout second time in 30s', () => {
      cy.visit('/home')

      // 設定攔截器
      cy.intercept({
        method: 'POST',
        path: '/time_clocks/ajax'
      }).as('clockout')

      // 點擊上班打卡
      cy.get('.desktopsite_right')
      .find('.clock_btn_block')
      .should('be.visible')
      .find('#clockout')
      .click()

      // 等待別名路由
      cy.wait('@clockout').then(({request, response}) => {
        console.log(response)
        expect(response.body.status).to.eq('fail')
        expect(response.body.message).to.eq('請稍後再打卡')
      })
    })
  })

})