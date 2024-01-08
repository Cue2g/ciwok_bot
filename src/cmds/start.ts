import { ContextFix } from "../../app";
import groupController from "../controllers/groupsControllers";
import activeUserController from "../controllers/activeUsersController";
import usersController from "../controllers/usersController";
import botController from "../controllers/botController";

import bot from "../../app";

export default async function start(ctx: ContextFix) {
    
    const messageChat = ctx.update.message?.chat;
    const startPayload = ctx.startPayload;
    const messageFrom = ctx.update.message?.from;
    const chat = ctx.chat;



    if (chat && chat.type != 'private') {
        if (!messageChat) return ctx.reply('No se pudo obtener el ID del grupo');
        const checkGroup = await groupController.check(messageChat.id);

        if (!checkGroup) {
            return ctx.reply('El grupo no está registrado. Para agregarlo, envíe el comando /agregarGrupo seguido del valor de la unidad');
        }
    }

    if (!startPayload) {
        if (chat && chat.type === 'private') return ctx.reply('Este mensaje funciona solo desde un grupo');
        if (!chat) return ctx.reply('No se pudo obtener el ID del grupo');
        return bot.telegram.sendMessage(chat.id, 'Registrar Tarea', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📤",
                            url: `https://t.me/${process.env.BOTNAME}?start=${chat.id}`
                        }
                    ]
                ]
            }
        })
    }


    const payloadNumber = Number(startPayload)
    if (!messageChat) return ctx.reply('No se pudo obtener el ID del grupo');

    const checkGroup = await groupController.check(payloadNumber);

    if (!checkGroup) {
        return ctx.reply('El grupo no está registrado. Para agregarlo, envíe el comando /agregarGrupo seguido del valor de la unidad');
    }

    if(!messageFrom) return ctx.reply('Error al obtener el ID');
    const checkUserActive = await activeUserController.check(messageFrom.id);

    if(!checkUserActive) {
        const registerActiveUser = await activeUserController.create({idUser: messageFrom.id, idGroup: payloadNumber});
        if(!registerActiveUser){
            return ctx.reply('Error al momento de registrar el chat, inténtelo de nuevo');
        }
    }else{
        const updateUserActive = await activeUserController.update(messageFrom.id, Number(startPayload))
        if(!updateUserActive){
            return ctx.reply('Error al momento de registrar el chat, inténtelo de nuevo');
        }
    }


    const lastName = messageFrom.last_name ?? " ";

    const createUserData = {
        id: messageFrom.id,
        userName: messageFrom.username ?? "",
        name: messageFrom.first_name + " " + lastName,
        idGroup: payloadNumber,
    };
    
    const userExists = await usersController.check(messageFrom.id);
    
    if (!userExists) {
        await usersController.create(createUserData);
    } else {
        const userInGroup = await usersController.checkGroupUser(messageFrom.id, Number(startPayload));
        if (!userInGroup) {
            await usersController.create(createUserData);
        }
    }

    if(!chat) return  ctx.reply("No se pudo obtener el id del chat")
    bot.telegram.sendMessage(chat.id, 'Listado de tareas por Tipos de servicio', {
        reply_markup: {
            inline_keyboard: botController.getServices()
        }
    })

}