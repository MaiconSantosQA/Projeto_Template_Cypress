class InsertBD {
  inserirUsuarioExemplo(userEmail) {
    let query1 =
      "INSERT INTO Account (email, password, name) VALUES ('" +
      userEmail +
      "','senha123','Maicon');";

    cy.task("executaBanco", query1);
  }
}

export default new InsertBD();
