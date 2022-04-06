const { Telegraf } = require("telegraf");
const crawler = require("./crawler");

// v9 compat packages are API compatible with v8 code
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "uan-bot.firebaseapp.com",
  projectId: "uan-bot",
  storageBucket: "uan-bot.appspot.com",
  messagingSenderId: "331725045104",
  appId: process.env.APP_ID,
  measurementId: "G-XX0MRG5L7Y",
};


firebase.initializeApp(firebaseConfig);

const con = firebase.firestore();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hears("teste", (ctx) =>
  ctx.reply("Bot funcionando.")
);

bot.launch();

module.exports = {
  async updateCardapio(refeicao) {
    let diaSemana = new Date().getDay();

    const response = await crawler.getUan(diaSemana, refeicao);
    console.log(response);
    console.log(response.dataConsulta)

    let data = response.dataConsulta.split(" ")[0];

    if (!response.erro) {
      const resObj = refeicao == 0 ?
       `
      -- CARDÁPIO DO ${response.tipo.toUpperCase()} --\n- ${response.diaCardapio}, ${response.dataConsulta} -\nAlimento: ${response.alimento}\nBebida: ${response.bebida}\n`
      :
       `-- CARDÁPIO DO ${response.tipo.toUpperCase()} --\n- ${response.diaCardapio}, ${response.dataConsulta} -\nPrato principal: ${response.pratoPrincipal}\nAcompanhamento: ${response.acompanhamento}\nGuarnição: ${response.guarnicao}\nEntrada: ${response.entrada}\nBebida: ${response.bebida == "-" ? "Não tem" : response.bebida}\nSobremesa: ${response.sobremesa == "-" ? "Não tem" : response.sobremesa}\n`;

      let conData = con.collection("ultimaRefeicao").doc("1");
      let ultimaRefeicaoDb = await conData.get();

      let ultimaRefeicao = ultimaRefeicaoDb.data();

      // console.log(`\n\n
      // 'RESPONSE || JSON'
      // ${data} || ${ultimaRefeicao.dataConsulta}\n
      // ${response.tipo} || ${ultimaRefeicao.tipo}\n
      // ${response.diaCardapio} || ${ultimaRefeicao.diaCardapio}\n\n
      // `);

      if (
        data != ultimaRefeicao.dataConsulta ||
        response.tipo != ultimaRefeicao.tipo ||
        response.diaCardapio != ultimaRefeicao.diaCardapio
      ) {
        bot.telegram.sendMessage(process.env.GROUP_ID, resObj).then(() => {
          console.log(
            "Mensagem enviada para o bot com sucesso às: " +
              new Date(Date.now()).toLocaleString()
          );
        });

        await con
          .collection("ultimaRefeicao")
          .doc("1")
          .set({
            tipo: response.tipo,
            dataConsulta: data,
            diaCardapio: response.diaCardapio,
          })
          .then((doc) => {
            console.log(
              "Última refeição atualizada no Firebase às: " +
                new Date(Date.now()).toLocaleString()
            );
          })
          .catch((e) => {
            console.log("ERRO FIREBASE: " + e);
          });
      }else {
        console.log('NÃO POSTADO! Última refeição postada é igual a atual.');
      }
    }
  },
};
