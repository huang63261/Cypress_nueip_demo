/// <reference types="cypress" />
import AttendanceRecordPage from '../../pages/AttendanceRecordPage.js'

describe('attendance record testing - Admin', () => {
  context('出勤紀錄', () => {
      beforeEach(() => {
      cy.viewport(1280, 800)
      cy.fixture('users/admin').then((users) => {
        cy.loginByCSRF(users)
      })
    })

    it('新增出勤紀錄', () => {
      AttendanceRecordPage.navigate()
      AttendanceRecordPage.initIntercept()
      AttendanceRecordPage.addRecord('RD', '測◯◯◯1', 'clockin', '2023-10-10 09:12:34', 'POM Testing')
    })
  })
})