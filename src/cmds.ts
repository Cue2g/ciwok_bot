import { ContextFix } from "../app";
import Telegraf from "telegraf";

///cmds
import { start } from "./cmds/start";

export function commands(bot: Telegraf<ContextFix>): void{
    bot.start(start);
}