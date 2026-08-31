describe('Contact Form', () => {
  it('submits successfully', () => {
    cy.visit('/contact')
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('textarea[name="message"]').type('This is a test message for IPMC.')
    cy.get('button[type="submit"]').click()
    cy.contains('Thank you', { timeout: 10000 })
  })

  it('honeypot field is hidden', () => {
    cy.visit('/contact')
    cy.get('input[name="website"]').should('not.be.visible')
  })
})
