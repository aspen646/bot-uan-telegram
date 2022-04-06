const puppeteer = require("puppeteer");

module.exports = {
  async getUan(dia, refeicao) {
    try {

      const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }); //{ headless: false}
      const page = await browser.newPage(); //https://www.sje.ifmg.edu.br/portal/index.php/cae-assuntos-estudantis/uan
      await page.goto(
        "https://solucoes.sje.ifmg.edu.br/CardapioUan/cardapio.php"
      );

      var returnObj = {};

      const diaSemana = [
        "Domingo",
        "Segunda-Feira",
        "Terça-Feira",
        "Quarta-Feira",
        "Quinta-Feira",
        "Sexta-Feira",
        "Sábado",
      ];

      const result = await page.evaluate(
        (dia, refeicao, returnObj, diaSemana) => {
          tbody = document.querySelectorAll("tbody")[dia];
          let date = new Date(Date.now()).toLocaleString();

          if (tbody.querySelectorAll("tr").length >= 2) {
            if (refeicao == 0) {
              // CAFÉ DA MANHÃ
              returnObj.dataConsulta = date.toString();
              returnObj.diaCardapio = diaSemana[dia];
              returnObj.tipo = "Café da Manhã";
              returnObj.bebida = tbody.querySelectorAll("tr td")[3].innerText;
              returnObj.alimento = tbody.querySelectorAll("tr td")[4].innerText;

              return returnObj;
            } else if (
              refeicao == 1 &&
              tbody.querySelectorAll("tr").length >= 4
            ) {
              // ALMOÇO
              returnObj.dataConsulta = date.toString();
              returnObj.diaCardapio = diaSemana[dia];
              returnObj.tipo = "Almoço";
              returnObj.entrada = tbody.querySelectorAll("tr td")[12].innerText;
              returnObj.pratoPrincipal =
                tbody.querySelectorAll("tr td")[13].innerText;
              returnObj.guarnicao =
                tbody.querySelectorAll("tr td")[14].innerText;
              returnObj.acompanhamento =
                tbody.querySelectorAll("tr td")[15].innerText +
                ", " +
                tbody.querySelectorAll("tr td")[16].innerText;
              returnObj.sobremesa =
                tbody.querySelectorAll("tr td")[17].innerText;
              returnObj.bebida = tbody.querySelectorAll("tr td")[18].innerText;

              return returnObj;
            } else if (
              refeicao == 2 &&
              tbody.querySelectorAll("tr").length >= 6
            ) {
              // JANTAR
              returnObj.dataConsulta = date.toString();
              returnObj.diaCardapio = diaSemana[dia];
              returnObj.tipo = "Jantar";
              returnObj.entrada = tbody.querySelectorAll("tr td")[26].innerText;
              returnObj.pratoPrincipal =
                tbody.querySelectorAll("tr td")[27].innerText;
              returnObj.guarnicao =
                tbody.querySelectorAll("tr td")[28].innerText;
              returnObj.acompanhamento =
                tbody.querySelectorAll("tr td")[29].innerText +
                ", " +
                tbody.querySelectorAll("tr td")[30].innerText;
              returnObj.sobremesa =
                tbody.querySelectorAll("tr td")[31].innerText;
              returnObj.bebida = tbody.querySelectorAll("tr td")[32].innerText;

              return returnObj;
            } else {
              // AINDA NÃO FOI POSTADO
              returnObj.dataConsulta = date.toString();
              returnObj.diaCardapio = diaSemana[dia];
              returnObj.erro = "Ainda não foi postado nenhum cardápio do dia";

              return returnObj;
            }
          } else {
            // AINDA NÃO FOI POSTADO
            returnObj.dataConsulta = date.toString();
            returnObj.diaCardapio = diaSemana[dia];
            returnObj.erro = "Ainda não foi postado nenhum cardápio do dia";

            return returnObj;
          }
        },
        dia,
        refeicao,
        returnObj,
        diaSemana
      );

      await browser.close();

      return result;
    } catch (e) {
      return e;
    }
  },
};
