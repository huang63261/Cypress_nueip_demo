describe('Clockin & out testing', () => {
  context('Login' ,() => {
    beforeEach(() => {
        cy.viewport(1280, 800)
        cy.fixture('users/user01').then((user) => {
        cy.loginByCSRF(user)
      })
    })

    // it('request 發出打卡請求', () => {
    //   cy.visit('/home')

      // cy.get('.desktopsite_right')
      //   .find('.clock_blcok')
      //   .find('input[name="token"]')
      //   .invoke('attr', 'value')
      //   .then((value) => {
    //     cy.request({
    //       method: 'POST',
    //       url: '/time_clocks/ajax',
    //       form: true,
    //       body: {
    //         action: 'add',
    //         id: '1',
    //         attendance_time: '2023-8-17 18:07:25',
    //         token: value,
    //         lat: '25.0511752',
    //         lng: '121.5960723',
    //       }
    //     }).as('clockinRequest')
    //   })

    //   cy.get('@clockinRequest').should((response) => {
    //     expect(response.status).to.eq(200)
    //     expect(response.body.status).to.eq('success')
    //   })
    // })

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
            body: response.stubbingTest,
            delay: 2000
          }).as('clockin')
      })

      // 點擊上班打卡
      cy.get('.desktopsite_right')
      .find('.clock_btn_block')
      .should('be.visible')
      .find('#clockin')
      .scrollIntoView()
      .click()

      // 等待別名路由
      cy.wait('@clockin').then(({request, response}) => {
        expect(response.statusCode).to.eq(400)
        expect(response.body.status).to.eq('fail')
        expect(response.body.message).to.eq('我是假的')
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
        .scrollIntoView()
        .click()

      // 等待別名路由
      cy.wait('@clockin', {timeout: 10000}).then(({request, response}) => {
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
        .scrollIntoView()
        .click()

      // 等待別名路由
      cy.wait('@clockin', {timeout: 10000}).then(({request, response}) => {
        expect(response.body.status).to.eq('fail')
      })
    })
  })

})