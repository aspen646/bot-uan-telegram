require("dotenv/config");
const schedule = require('node-schedule');
const bot = require('./bot');

// var a = schedule.scheduleJob('*/10 * * * * *',()=>{bot.updateCardapio()});

// bot.updateCardapio(1);

//digital ocean usar +3h

const rule = new schedule.RecurrenceRule();
rule.hour = new schedule.Range(8, 9);
rule.dayOfWeek = new schedule.Range(0, 6);
rule.minute = new schedule.Range(0, 59);
schedule.scheduleJob(rule, () => {
  bot.updateCardapio(0)
  console.log('Schedule de Café da Manhã rodando às ' + new Date(Date.now()).toLocaleString());
});

const ruleAlmoco = new schedule.RecurrenceRule();
ruleAlmoco.hour = new schedule.Range(11, 14);
ruleAlmoco.dayOfWeek = new schedule.Range(0, 6);
ruleAlmoco.minute = new schedule.Range(0, 59);
schedule.scheduleJob(ruleAlmoco, () => {
  bot.updateCardapio(1)
  console.log('Schedule de Almoço rodando às ' + new Date(Date.now()).toLocaleString());
});

const ruleJantar = new schedule.RecurrenceRule();
ruleJantar.hour = new schedule.Range(19, 21);
ruleJantar.dayOfWeek = new schedule.Range(0, 6);
ruleJantar.minute = new schedule.Range(0, 59);
schedule.scheduleJob(ruleJantar, () => {
  bot.updateCardapio(2)
  console.log('Schedule de Jantar rodando às ' + new Date(Date.now()).toLocaleString());
});

console.log('Servidor iniciado às ' + new Date(Date.now()).toLocaleString());

console.log("BOT_TOKEN:"+process.env.BOT_TOKEN)