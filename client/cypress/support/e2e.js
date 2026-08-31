Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', 'http://localhost:5000/api/auth/login', { email, password }).then((res) => {
    window.localStorage.setItem('accessToken', res.body.data.accessToken)
    window.localStorage.setItem('refreshToken', res.body.data.refreshToken)
  })
})
