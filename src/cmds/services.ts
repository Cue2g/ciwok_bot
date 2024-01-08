import { ContextFix } from "../../app";
import botController from "../controllers/botController";
import activeUserController from "../controllers/activeUsersController";
import bot from "../../app";



let conditionToStopEaringMessages = true

export default async function services(ctx: ContextFix){
    try {
        await ctx.deleteMessage()
    } catch (error) {
        return ctx.reply('Por favor, asegúrese de seleccionar solo una opción');
    }

    const callbackQuery = ctx.update.callback_query

    if(!callbackQuery) return ctx.reply('Error al obtener el query');
    const option = callbackQuery.data,
    cQFrom = callbackQuery.from,
    optionValue = botController.listServices.find(service => option === service.name);

    if (!optionValue) {
        return ctx.reply('Error al obtener el valor de la opción, inténtelo de nuevo');
    }
    activeUserController.updateStatus(Number(cQFrom.id),optionValue.name, optionValue.valor);
    conditionToStopEaringMessages = false;
    ctx.reply(`Ha seleccionado: ${option}

Ingrese la persona y la cantidad
        `);

        bot.on('text', async (ctx) => {
            try {

                if (!conditionToStopEaringMessages) {
                
                    if (!ctx.message || !ctx.update.message) throw new Error('Error en el contexto');
    
                    const messageFrom = ctx.message.from,
                        messageChat = ctx.update.message.chat,
                        messageText = ctx.update.message.text
    
                    if(!messageFrom) throw new Error('Error en el mensaje');
    
                    if (messageChat.id != messageFrom.id) {
                        return
                    }
    
                    const checkActive = await activeUserController.checkIfActive(messageFrom.id);
                    

                    
                    if (!checkActive) {
                        return
                    }
                    

                    
                    const dataActiveUser = await activeUserController.find(messageFrom.id);


                    if (!dataActiveUser) {
                        return
                    }
    
                    if(!messageText) throw new Error('Error en el mensaje de texto');

    
                    if (conditionToStopEaringMessages === false && checkActive === true) {
                        const responseData = await botController.saveTask(messageText, dataActiveUser, ctx);
    
                        if (responseData) {
                            await activeUserController.endStatus(messageFrom.id);
                        }
    
                        const activesUsers = await activeUserController.checkAllActives()
    
                        if (!activesUsers) {
                            conditionToStopEaringMessages = true
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                return ctx.reply('Hubo un error al realizar la operacion')
            }

            

        })

}