class DeleteBD {
  accountExample() {
    var queryAccount = "DELETE FROM Account";

    cy.task("executaBanco", queryAccount);
  }
}

export default new DeleteBD();
