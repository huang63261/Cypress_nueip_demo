/// <reference types="cypress" />

describe('出勤紀錄管理', () => {
  context('出勤紀錄管理匯入', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/hr').then((user) => {
        cy.loginByCSRF(user)
      })

      cy.visit('/attendance_management')
    })

    it('檔案匯入成功並且成功刪除', () => {
      // 設置攔截器
      cy.intercept({
        url: '/attendance_management/ajax',
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
        url: '/attendance_management/ajax',
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
        url: '/attendance_management/ajax',
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