/// <reference types="cypress" />

describe('出勤紀錄管理', () => {
  context('出勤紀錄管理匯入', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/hr').then((user) => {
        cy.loginByCSRF(user)
      })

      cy.visit(Cypress.env('attendance_management_url'))
    })

    it('匯入設定', () => {
      // 設置攔截器
      cy.intercept({
        url: Cypress.env('attendance_management_url') + '/ajax',
        method: 'POST',
      }).as('ajax')

      // 進入匯入設定
      cy.visit(Cypress.env('attendance_management_url') + '/setting')

      // 等待初始化載入請求
      .wait('@ajax').then(({request, response}) => {
        expect(response.statusCode).to.be.eq(200)
      })

      // 驗證網址
      cy.url().should('contain', 'attendance_management/setting')

      // 點擊格式一
      cy.get('#format_type_1').click().should('have.class', 'selected_border')

      // 下一步
      cy.get('a[href="#next"]').click()

      // 選擇檔案類型
      cy.get('#file_type_txt').click().should('have.class', 'selected_border')

      // 下一步
      cy.get('a[href="#next"]').click()

      // 等待「打卡格式、檔案類型 設定」請求返回
      cy.wait('@ajax').then(({request, response}) => {
        expect(request.body).to.be.eq('action=import_item&file_type=txt&format_type=1')
        expect(response.statusCode).to.be.eq(200)
      })

      cy.get('#setting_view').within(() => {
        // 參數設定資料格式
        let sequence = {
          0: '1',
          1: '4',
          2: '6',
        }

        // 選擇資料格式
        cy.get('div[value="1"]').click()
        cy.get('div[value="4"]').click()
        cy.get('div[value="6"]').click()

        // 驗證資料格式
        cy.get('#data_area').children().each(($el, idx) => {
          expect($el.attr('value')).to.be.eq(sequence[idx])
        })

        // 上班時段
        cy.get('input[name="section[1]"]').clear().type('1').invoke('prop', 'value').should('eq', '1')
        cy.get('input[name="section[2]"]').clear().type('2').invoke('prop', 'value').should('eq', '2')

        // 時間格式
        cy.get('#bind_time').within(() => {
          cy.get('select[name="time_form[0]"]').select('y')
          cy.get('select[name="time_form[1]"]').select('/')
          cy.get('select[name="time_form[2]"]').select('m')
          cy.get('select[name="time_form[3]"]').select('/')
          cy.get('select[name="time_form[4]"]').select('d')
          cy.get('select[name="time_form[5]"]').select('p')
          cy.get('select[name="time_form[6]"]').select('h')
          cy.get('select[name="time_form[7]"]').select(':')
          cy.get('select[name="time_form[8]"]').select('i')
          cy.get('select[name="time_form[9]"]').select(':')
          cy.get('select[name="time_form[10]"]').select('s')
        })

        cy.get('#is_smart_import').within(() => {
          // 智慧判斷 - 否
          cy.get('input[id="smart_import2"]').check().should('be.checked')
        })
      })

      // 點擊完成
      cy.get('a[href="#finish"]').click()

      // 匯入設定成功
      cy.wait('@ajax').then(({request, response}) => {
        expect(request.body).to.contain('action=setting')
        expect(response.body.status).to.eq('success')
      })
    })

    it('檔案匯入成功並且成功刪除', () => {
      // 設置攔截器
      cy.intercept({
        url: Cypress.env('attendance_management_url') + '/ajax',
        method: 'POST',
      }).as('ajax')

      // 等待首次進入頁面查詢完成
      cy.wait('@ajax').then(({request, response}) => {
        expect(request.body).to.include('action=import_list')
        expect(response.statusCode).to.equal(200)
      })

      // 上傳檔案
      cy.get('input[id="fileupload"]').selectFile('./cypress/fixtures/attendance_management/attendance.txt', {force: true})

      // 等待檔案上傳請求
      cy.wait('@ajax').then(({request, response}) => {
        expect(response.body.code).to.equal('200')
        expect(response.body.message).to.include('匯入成功')

        // 點擊關閉按鈕
        cy.contains('關閉').should('be.visible').click()
      })

      // 點擊刪除按鈕
      cy.contains('attendance.txt').siblings('td[data-th="刪除"]').should('be.visible').find('#delete').click()

      // 刪除確定
      cy.contains('button', '確定').should('be.visible').click()
    })

    it('檔案匯入失敗', () => {
      // 設置攔截器
      cy.intercept({
        url: Cypress.env('attendance_management_url') + '/ajax',
        method: 'POST',
      }).as('ajax')

      // 等待首次進入頁面查詢完成
      cy.wait('@ajax').then(({request, response}) => {
        expect(request.body).to.include('action=import_list')
        expect(response.statusCode).to.equal(200)
      })

      // 上傳檔案
      cy.get('input[id="fileupload"]').selectFile('./cypress/fixtures/attendance_management/attendance_fail.txt', {force: true})

      // 等待檔案上傳請求
      cy.wait('@ajax').then(({request, response}) => {
        expect(response.body.code).to.equal('400')
        expect(response.body.message).to.include('無資料被匯入')

        // 點擊關閉按鈕
        cy.contains('關閉').should('be.visible').click()
      })
    })

    it('匯入檔案格式錯誤', () => {
      // 設置攔截器
      cy.intercept({
        url: Cypress.env('attendance_management_url') + '/ajax',
        method: 'POST',
      }).as('ajax')

      // 等待首次進入頁面查詢完成
      cy.wait('@ajax').then(({request, response}) => {
        expect(request.body).to.include('action=import_list')
        expect(response.statusCode).to.equal(200)
      })

      // 上傳檔案
      cy.get('input[id="fileupload"]').selectFile('./cypress/fixtures/attendance_management/attendance_wrongFormat.xlsx', {force: true})

      // 等待檔案上傳請求
      cy.wait('@ajax').then(({request, response}) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.equal('檔案格式有誤')
      })
    })
  })
})