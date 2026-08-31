describe('404 Page', () => {
  it('shows rich 404 with search', () => {
    cy.visit('/nonexistent-page')
    cy.contains('404')
    cy.contains('Page Not Found')
    cy.get('input[placeholder*="Search"]').should('be.visible')
  })

  it('suggested pages work', () => {
    cy.visit('/nonexistent-page')
    cy.contains('Home').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
