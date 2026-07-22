describe('Acessar um site qualquer', () => {
  it('Valida o acesso ao Google', () => {
    cy.visit('https://google.com')
  })
})