describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads successfully', () => {
    cy.contains('IPMC Nigeria')
    cy.title().should('include', 'IPMC')
  })

  it('has working navigation', () => {
    cy.get('nav').should('be.visible')
    cy.get('a[href="/services"]').first().click()
    cy.url().should('include', '/services')
    cy.contains('Our Services')
  })

  it('has working dark mode toggle', () => {
    cy.get('html').should('not.have.class', 'dark')
    cy.get('button[aria-label*="dark mode"]').click()
    cy.get('html').should('have.class', 'dark')
  })

  it('scrolls to sections', () => {
    cy.get('a[href="#services"]').click()
    cy.get('#services').should('be.visible')
  })
})
