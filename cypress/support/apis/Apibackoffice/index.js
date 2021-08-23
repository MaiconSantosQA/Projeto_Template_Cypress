class Apibackoffice {
  autenticacao(metodo, request) {
    cy.getToken().then((token) => {
      cy.request({
        method: metodo,
        url: request,
        headers: { Authorization: token },
      });
    });
  }

  iniciarCampeonato(tournamentId) {
    let metodo = "POST";
    let url =
      "http://gamersclub-backoffice-qa-backend:3000/v1/backoffice/tournaments/"  +tournamentId  +"/start";

    this.autenticacao(metodo, url);
  }

  iniciarPartida(tournamentId) {
    let metodo = "POST";
    let url =
      "http://gamersclub-backoffice-qa-backend:3000/v1/backoffice/tournaments/"  +tournamentId  +"/brackets/generate";

    this.autenticacao(metodo, url);
  }

  gerarGrupos(tournamentId) {
    cy.getToken().then((token) => {
      cy.request({
        method: "POST",
        url: "http://gamersclub-backoffice-qa-backend:3000/v1/backoffice/tournaments/"  +tournamentId  +"/groups/generate",
        headers: { Authorization: token },
        body: {
          championCount: 1,
          groupSize: 2,
        },
      }).as("response");
    });
  }

  gerarResultadoPartida(tournamentRoundID, teamId) {
    cy.getToken().then((token) => {
      cy.request({
        url: "http://gamersclub-backoffice-qa-backend:3000/v1/backoffice/round/finish",
        method: "POST",
        headers: { Authorization: token },
        body: {
          tournamentRoundId: tournamentRoundID,
          winnerId: teamId,
        },
      }).as("response");
    });
  }

  finalizarCampeonato(tournamentId) {
    let metodo = "PUT";
    let url =
      "http://gamersclub-backoffice-qa-backend:3000/v1/backoffice/tournaments/"  +tournamentId  +"/finish";

    this.autenticacao(metodo, url);
  }

  gerarResultadoPartidaViaJson(pathTournament, pathTeam) {
    cy.readFile(pathTournament).then((tournRound) => {
      cy.readFile(pathTeam).then((team) => {
        this.gerarResultadoPartida(tournRound.id, team.id);
      });
    });
  }
}

export default new Apibackoffice();
