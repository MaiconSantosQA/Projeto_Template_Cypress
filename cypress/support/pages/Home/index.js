const el = require("./elements").ELEMENTS;

class HOME {
  acessarHomePage() {
    cy.visit("/");
  }

  preencherEmail(email) {
    cy.xpath(el.txtEmail).should("be.visible").type(email);
  }

  preencherSenha(pass) {
    cy.xpath(el.txtPassword).should("be.visible").type(pass);
  }

  clicarLogar() {
    cy.xpath(el.btnLogin).should("be.visible").click();
  }

  logarBackoffice(email, pass) {
    this.preencherEmail(email);
    this.preencherSenha(pass);
    this.clicarLogar();
  }

  //Exemplo de interceptação de uma chamada API.
  aguardarAutenticacao() {
    cy.intercept("/v1/backoffice/*").as("signin");
    cy.wait("@signin");
  }
}

export default new HOME();
