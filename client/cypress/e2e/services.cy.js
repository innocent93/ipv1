describe('Services', () => {
  it('displays all services', () => {
    cy.visit('/services')
    cy.contains('Our Services')
    cy.get('[data-testid="service-card"]').should('have.length.at.least', 1)
  })

  it('filters by category', () => {
    cy.visit('/services')
    cy.contains('Financial').click()
    cy.url().should('include', 'category=financial')
  })

  it('navigates to service detail', () => {
    cy.visit('/services')
    cy.get('[data-testid="service-card"]').first().click()
    cy.url().should('match', /\/services\//)
    cy.get('h1').should('be.visible')
  })

  it('shows related services', () => {
    cy.visit('/services/project-administration')
    cy.contains('Related Services')
  })
})
