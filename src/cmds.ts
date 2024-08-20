import { ContextFix } from "../app";
import Telegraf from "telegraf";
import botController from "./controllers/botController";
///cmds
import start from "./cmds/start";
import addGroup from "./cmds/addGroup";
import services from "./cmds/services";
import tarea from "./cmds/tarea";


const listOfActions = botController.listServices.map(service => service.name)

export function commands(bot: Telegraf<ContextFix>): void {
    bot.start(start);
    bot.command('/agregarGrupo', addGroup);
    bot.action(listOfActions, services);
    bot.command('/tarea', tarea);
    bot.command('/version' ,(ctx) => {
        ctx.reply('1.0.4 - 20-ago-2024    @.@')
    })
}