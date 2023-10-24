import Page from "./page";
class AttendanceRecordPage extends Page {
  /**
   * define elements
   */
  // 出勤新增按鈕
  get recordAddBtn() {return cy.get('#sys_add')};
  // 出勤新增彈窗
  recordAddModal = {
    // 彈窗body
    get body() {return cy.get('#ModalBody')},
    // 公司下拉選單
    get compDropdown() {return cy.get('#FLayer2')},
    // 部門下拉選單
    get deptDropdown() {return cy.get('[data-id="SLayer2"]')},
    // 部門下拉選單選項
    get deptDropdownOptions() {return cy.get('div.apply_company_unit > .dropdown-menu')},
    // 員工下拉選單
    get empDropdown() {return cy.get('[data-id="TLayer2"]')},
    // 部門下拉選單選項
    get empDropdownOptions() {return cy.get('div.apply_unit_emp > .dropdown-menu')},
    // 上班 radio
    get clockInRadio() {return cy.get('.radio-inline > input[id="clockin"]')},
    // 下班 radio
    get clockOutRadio() {return cy.get('.radio-inline > input[id="clockout"]')},
    // 打卡時間
    get clockTime() {return cy.get('input[name="work_time"]')},
    // 說明欄
    get remarkTextarea() {return cy.get('textarea[name="remark"]')},
    // 儲存按鈕
    get saveBtn() {return cy.get('#ModalSave')},
  }

  // 導向至功能頁
  navigate() {
    return super.navigate(Cypress.env('attendance_url'));
  }

  // 初始化攔截器
  initIntercept() {
    cy.intercept({
      method: "POST",
      path: "/shared/org_cascade_select_ajax"
    }).as('getOrgTree')

    cy.intercept({
      method: "POST",
      path: "/attendance_record/ajax",
    }).as('ajax')
  }

  addRecord(dept, emp, clockType, clockTime, remark) {
    // 點擊新增打卡鈕
    this.recordAddBtn.click()

    cy.wait('@getOrgTree').then(() => {
      // 抓取新增Modal
      this.recordAddModal.body.within(() => {
        // 選取部門
        this.recordAddModal.deptDropdown.should('be.visible').click()

        // 點選 "RD" 選項
        this.recordAddModal.deptDropdownOptions.contains(dept).click()
        this.recordAddModal.deptDropdown.invoke('attr', 'title').should('eq', dept)

        // 選取員工
        this.recordAddModal.empDropdown.should('be.visible').click()

        // 點選 "測◯◯◯1" 選項
        this.recordAddModal.empDropdownOptions.contains(emp).click()
        this.recordAddModal.empDropdown.invoke('attr', 'title').should('eq', emp)

        switch (clockType) {
          // 上班
          case 'clockin':
            this.recordAddModal.clockInRadio.click().should('be.checked')
            break;
          // 下班
          case 'clockout':
            this.recordAddModal.clockOutRadio.click().should('be.checked')
            break;
        }

        // 選擇打卡時間
        this.recordAddModal.clockTime.clear().type(clockTime + '{enter}')

        // 說明欄
        this.recordAddModal.remarkTextarea.clear().type(remark)
      })

      // 儲存
      this.recordAddModal.saveBtn.click()

      cy.wait('@ajax').then(({request, response}) => {
        expect(response.statusCode).to.eq(200)
      })
    })

  }
}

export default new AttendanceRecordPage();
