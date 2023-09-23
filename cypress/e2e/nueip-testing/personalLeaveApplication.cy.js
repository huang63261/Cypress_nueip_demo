/// <reference types="cypress" />

describe('請假作業', () => {
  context('請假', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/user01').then((user) => {
        cy.loginByCSRF(user)
      })

      cy.visit(Cypress.env('leave_application_url').user)
    })

    it('查詢假單&快速查詢', () => {
      // 設置攔截器
      cy.intercept({
        url: Cypress.env('leave_application_url').user,
        method: 'POST',
      }).as('generalRequest')

      cy.wait('@generalRequest').then(({request, response}) => {
        expect(request.body).to.include('action=list')
        expect(response.statusCode).to.equal(200)
      })

      // 抓取搜尋表單
      cy.get('form[name="cookie_form"]').should('be.visible').within(() => {
        // 選擇部門： 全部
        cy.get('[data-id="SLayer"]').should('be.visible').click()
        cy.get('div.time-off-search_company_unit').should('have.class', 'open').contains('span.text', '全部').click()

        // 選擇員工： 全部
        cy.get('[data-id="TLayer"]').should('be.visible').click()
        cy.get('div.time-off-search_unit_emp').should('have.class', 'open').contains('span.text', '全部').click()

        // 快速搜尋 - 上個月
        cy.get('#filiter_before_month').click()
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
        // 快速搜尋 - 昨日
        cy.get('#filiter_yestoday').click()
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
        // 快速搜尋 - 本日
        cy.get('#filiter_today').click()
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
        // 快速搜尋 - 明日
        cy.get('#filiter_tomorrow').click()
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
        // 快速搜尋 - 本週
        cy.get('#filiter_week').click()
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
        // 快速搜尋 - 本月
        cy.get('#filiter_month').click()
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })

        // 選擇部門： RD
        cy.get('[data-id="SLayer"]').should('be.visible').click()
        cy.get('div.time-off-search_company_unit').should('have.class', 'open').contains('span.text', 'RD').click()

        // 選擇員工： 測◯◯◯1
        cy.get('[data-id="TLayer"]').should('be.visible').click()
        cy.get('div.time-off-search_unit_emp').should('have.class', 'open').contains('span.text', '測◯◯◯1').click()

        // 填寫日期區間
        cy.get('input[name="s_date"]').clear().type('2023-08-15{enter}').should('have.value', '2023-08-15')
        cy.get('input[name="e_date"]').clear().type('2023-08-31{enter}').should('have.value', '2023-08-31')

        // 選擇假別： 事假
        cy.get('select[id="VLayer"]').should('be.visible').select('事假')

        // 點擊查詢
        cy.get('button[id="filter"]').should('be.visible').click()

        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
      })
    })

    it('請假申請成功後查詢並刪除', () => {
      // 設定Intercept
      cy.intercept('GET', '/leave_application/personal_leave_application_user/getLeaveRule').as('getLeaveRule')

      cy.intercept({
        method: 'POST',
        url: Cypress.env('leave_application_url').user,
      }).as('generalRequest')

      // 取得當天日期（平日）
      const date = getTimeoffDate()
      // 取得隔一天（平日）
      let oriDate = new Date(date)
      oriDate.setDate(oriDate.getDate() + 1)
      const nextDay = getTimeoffDate(oriDate)

      // 等待首次取得請假資料
      cy.wait('@generalRequest').then(({request, response}) => {
        // 點擊請假申請
        cy.get('#add').should('have.text', '請假申請').click()
      })

      // 等待抓取規則資料請求返回
      cy.wait('@getLeaveRule').then(() => {
        cy.get('.bootstrap-dialog-message').find('#leave_save_form').within(($formEl) => {
          // 選擇假別
          cy.get('.time-off_emp_leave').select('事假')

          // 選擇日期
          cy.get('#s_date').should('be.visible').clear().type(date + '{enter}')
          cy.get('#d_date').should('be.visible').clear().type(date + '{enter}')

          // 點擊新增日期按鈕
          cy.get('.moreDate').should('be.visible').click()

          // 等待新增日期
          cy.wait('@generalRequest').then(({request, response}) => {
            expect(request.body).to.include("action=getWorksHours")
            expect(response.statusCode).to.equal(200)

            // 選擇日期
            cy.get('#s_date').should('be.visible').clear().type(nextDay + '{enter}')
            cy.get('#d_date').should('be.visible').clear().type(nextDay + '{enter}')

            // 點擊新增日期按鈕
            cy.get('.moreDate').should('be.visible').click()
          })

          // 等待新增日期
          cy.wait('@generalRequest').then(({request, response}) => {
            expect(request.body).to.include("action=getWorksHours")
            expect(response.statusCode).to.equal(200)

          // 將時間改為12:00
          cy.get(`.labal-date[data-day="${date}"]`).parents('.ctrl-day').find('.end').clear().type('12:00{enter}')
          })

          // 輸入原因
          cy.get('textarea[name="remark"]').should('be.visible').type('請假申請自動化測試')
        })

        // 點擊確認
        cy.get('#ctrl-save').should('be.visible').click()

        // 檢查職務代理人是否同時間請假
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=subtimeoff')
          expect(response.body.code).to.equal(200)
        })

        // 請假申請成功
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('add')
          expect(response.statusCode).to.equal(200)
        })
      })

      // 重新載入頁面 載入請假資料
      cy.wait('@generalRequest').then(({request, response}) => {
        expect(request.body).to.include('action=list')
        expect(response.statusCode).to.equal(200)
      })

      /**
       * 抓取搜尋表單
       */
      cy.get('form[name="cookie_form"]').should('be.visible').within(() => {
        // 選擇部門： RD
        cy.get('[data-id="SLayer"]').should('be.visible').click()
        cy.get('div.time-off-search_company_unit').should('have.class', 'open').contains('span.text', 'RD').click()

        // 選擇員工： 測◯◯◯1
        cy.get('[data-id="TLayer"]').should('be.visible').click()
        cy.get('div.time-off-search_unit_emp').should('have.class', 'open').contains('span.text', '測◯◯◯1').click()

        // 填寫日期區間
        cy.get('input[name="s_date"]').clear().type(date + '{enter}').should('have.value', date)
        cy.get('input[name="e_date"]').clear().type(nextDay + '{enter}').should('have.value', nextDay)

        // 選擇假別： 事假
        cy.get('select[id="VLayer"]').should('be.visible').select('事假')

        // 點擊查詢
        cy.get('button[id="filter"]').should('be.visible').click()

        // 等待搜尋完成
        cy.wait('@generalRequest').then(({request, response}) => {
          expect(request.body).to.include('action=list')
          expect(response.statusCode).to.equal(200)
        })
      })

      // 抓取目標假單
      cy.get('td[data-th="申請說明"]')
        .should('have.text', '請假申請自動化測試')
        .siblings('td[data-th="開始時間"]')
        .should('have.text', date)
        .siblings('td[data-th="結束時間"]')
        .should('have.text', nextDay)
        .parent('tr').as('leaveApplication')

      // 展開子層假單
      cy.get('@leaveApplication')
        .find('i.comb_audit')
        .should('be.visible')
        .and('exist')
        .click()

      // 從目標假單中找到刪除checkbox
      cy.get('@leaveApplication')
        .find('input.delete-box')
        .click()
        .should('be.checked')

      // 點擊刪除鈕
      cy.get('button[id="delete"]').should('exist').click()

      // // 點擊“是”
      cy.get('input[data-value="yes"]').should('exist').wait(100).click()
    })
  })
})

/**
 * 取得日期（限平日）
 * @param {object} oriDate
 * @returns {string} date [yyyy-mm-dd]
 */
function getTimeoffDate(oriDate = null) {
  let date = oriDate == null ? new Date() : oriDate;
  // 檢查當前日期是否為週末 (0 代表週日, 6 代表週六)
  while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}