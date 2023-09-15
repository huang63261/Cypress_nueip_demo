/// <reference types="cypress" />

describe('attendance record testing - Admin', () => {
  context('出勤紀錄測試案例', () => {
      beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/admin').then((users) => {
        cy.loginByCSRF(users)
      })
    })

    it('新增、查詢、修改後再刪除', () => {
      cy.visit('/attendance_record')

      cy.location().then((location) => {
        expect(location.pathname).to.be.eq('/attendance_record')
      })

      cy.intercept({
          method: "POST",
          path: "/shared/org_cascade_select_ajax"
        }).as('recordAdd')

      cy.intercept({
          method: "POST",
          path: "/attendance_record/ajax",
        }).as('ajax')

      // 進入畫面首次查詢
      cy.wait('@ajax').then(({request, response}) => {
        expect(response.statusCode).to.equal(200)
      })

      // 點擊新增打卡鈕
      cy.get('#sys_add').click()

      cy.wait('@recordAdd').then(() => {
        // 抓取新增Modal
        cy.get('#ModalBody').within(() => {
          // 選取部門
          cy.get('[data-id="SLayer2"]').debug().should('be.visible').click()

          // 點選 "RD" 選項
          cy.get('div.apply_company_unit > .dropdown-menu').contains('RD').click()
          cy.get('[data-id="SLayer2"]').invoke('attr', 'title').should('eq', 'RD')

          // 選取員工
          cy.get('[data-id="TLayer2"]').should('be.visible').click()

          // 點選 "測◯◯◯1" 選項
          cy.get('div.apply_unit_emp > .dropdown-menu').contains('測◯◯◯1').click()
          cy.get('[data-id="TLayer2"]').invoke('attr', 'title').should('eq', '測◯◯◯1')

          // 點選上班
          cy.get('.radio-inline > input[id="clockin"]').click().should('be.checked')

          // 點選下班
          cy.get('.radio-inline > input[id="clockout"]').click().should('be.checked')

          // 選擇打卡時間
          cy.get('input[name="work_time"]').clear().type('2023-08-08 18:12:34{enter}')

          // 說明欄
          cy.get('textarea[name="remark"]').clear().type('自動化測試')
        })

        cy.get('#ModalSave').click()

        cy.wait('@ajax').then(({request, response}) => {
          expect(response.statusCode).to.eq(200)
        })
      })

      // 查詢
      cy.get('[name="cookie_form"]').within(() => {
        cy.get('[data-id="SLayer"]').click()
        cy.get('div.search_company_unit > div.dropdown-menu.open > .inner.open').contains('RD').click()
        cy.get('[data-id="SLayer"]').invoke('attr', 'title').should('eq', 'RD')

        cy.get('[data-id="TLayer"]').click()
        cy.get('div.search_unit_emp > div.dropdown-menu.open > .inner.open').contains('測◯◯◯1').click()
        cy.get('[data-id="TLayer"]').invoke('attr', 'title').should('eq', '測◯◯◯1')

        cy.get('[name="date_start"]').clear().type('2023-08-08{enter}').invoke('prop', 'value').should('eq', '2023-08-08')
        cy.get('[name="date_end"]').clear().type('2023-08-08{enter}').invoke('prop', 'value').should('eq', '2023-08-08')
        cy.get('#filter').click()
      })

      // 等待查詢完成
      cy.wait('@ajax').then(() => {
        // 點擊修改按鈕
        cy.get('#modify').click()

        cy.get('input[value="自動化測試"]').each(($input) => {
          cy.wrap($input).scrollIntoView()

          cy.wrap($input)
            .parents('tr')
            .find('input[type="radio"][value="1"]')
            .click()
            .should('be.checked')
        })

        cy.get('#save').click()
      })

      cy.wait('@ajax').then(() => {
        // 點擊修改按鈕
        cy.get('#modify').click()

        cy.get('input[value="自動化測試"]').each(($input) => {
          cy.wrap($input).scrollIntoView()
          cy.wrap($input)
            .parents('td')
            .siblings('td.text_align_center')
            .find('.DeleteBtn')
            .click()

          cy.get('input[data-value="yes"]').should('exist').wait(100).click()
        })
        cy.get('#save').click()
      })

    })
  })
})