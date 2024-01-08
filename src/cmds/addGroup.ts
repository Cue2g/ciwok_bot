import { ContextFix } from "../../app";
import groupController from "../controllers/groupsControllers";
import { IGroups } from "../models/Groups";

export default async function addGroup(ctx:ContextFix){
    try {
        const messageText = ctx.update.message?.text
        const chat = ctx.chat;
        if(!chat) return ctx.reply('No se pudo obtener el ID del chat, inténtelo de nuevo');
        if (chat.type === 'private') {
            return ctx.reply('Este comando solo puede ser utilizado en un grupo');
        };
        const checkGroup = await groupController.check(chat.id);
        if(checkGroup){
            return ctx.reply('El grupo ya está registrado');
        }
        if(!messageText) throw new Error('Error en el texto del mensaje');
        const text: string = messageText.replace('/agregarGrupo', '').trim();
        if(!text) return ctx.reply('El valor se encuentra vacío');
        const value: number =Number(text);
        if(!value) return ctx.reply('El formato del valor es incorrecto');
        const date = new Date();
    
        const data:IGroups = {
            value,
            id: chat.id,
            type: chat.type,
            createdAt: date,
            title: chat.title ?? chat.id.toString()
        }
        await groupController.create(data);
        return ctx.reply(`¡Se ha guardado el grupo ${chat.title} con éxito!`);
    } catch (error) {
        console.log(error)
        return ctx.reply('Hubo un error al intentar registrar el grupo')
    }
}