describe('Authentication', () => {
  it('admin login works', () => {
    cy.visit('http://localhost:5174/login')
    cy.get('input[name="email"]').type('admin@ipmc-ng.com')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('shows error on bad credentials', () => {
    cy.visit('http://localhost:5174/login')
    cy.get('input[name="email"]').type('bad@user.com')
    cy.get('input[name="password"]').type('wrong')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid credentials')
  })
})
