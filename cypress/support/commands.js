let login = require("../fixtures/login.json");

Cypress.Commands.add("getToken", () => {
  cy.request({
    method: "POST",
    url: "http://gamersclub-backoffice-qa-backend:3000/v1/backoffice/accounts/signin",
    body: {
      email: login.email,
      password: login.password,
      recaptchaToken: "fsdfsfsd",
    },
  })
    .its("headers.authorization")
    .should("not.be.empty")
    .then((token) => {
      return token;
    });
});
