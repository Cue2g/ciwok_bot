import { ContextFix } from "../../app";

export async function start(ctx:ContextFix){
    const messageChat = ctx.update.message;
    const startPayload = ctx.startPayload;
    const messageFrom = ctx.update.message?.from;
    const chat = ctx.chat;

    if(chat && chat.type != 'private'){
        const group = 'test'
    }
}