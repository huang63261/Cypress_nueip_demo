class Page {
  navigate(path) {
    return cy.visit(path)
  }
}

export default Page
