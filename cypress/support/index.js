import "./commands";

import Delete from "../support/BD/delete";
import Insert from "../support/BD/insert";
import Home from "../support/pages/Home/";

import "@shelex/cypress-allure-plugin";
// you can use require:
require("@shelex/cypress-allure-plugin");
require("cypress-xpath");

let login = require("../fixtures/login.json");

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

beforeEach(() => {
  //Aqui é adicionado um metodo padrao pra ser executado antes de todos os testes de todas as classes.
});
