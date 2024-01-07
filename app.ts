import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { commands } from "./src/cmds";
import mongoose from "mongoose";
require('dotenv').config();

export interface ContextFix extends TelegrafContext {
  startPayload?: string;
}

///db
const userdb = process.env.DB_USER,
pwdb = process.env.DB_PW,
namedb = process.env.DB_NAME,
url = `mongodb+srv://${userdb}:${pwdb}@cluster0.4qxcs.mongodb.net/${namedb}`

const bot = new Telegraf<ContextFix>(process.env.TOKEN as string);

export default bot;
commands(bot);

mongoose.connect(url).then(()=>{
  console.log('mongo connected');
  bot.launch()
  .then(() => console.log('Bot is live ' + Date.now() ))
  .catch((err) => {
    console.log('error')
    console.log(err)
  })
}).catch(() => {
  console.log('error connecting to mongo')
})

