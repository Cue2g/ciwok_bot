import { ContextFix } from "../../app";
import botController from "../controllers/botController";
import groupController from "../controllers/groupsControllers";


import { BodyTarea } from "../controllers/botController";

export default async function tarea(ctx: ContextFix) {

    const updateMessage = ctx.update.message;
    if (!updateMessage) return ctx.reply('Error al obtener la información');

    const messageFrom = updateMessage.from;
    if (!messageFrom) return ctx.reply('Error al obtener la información');

    const messageText = updateMessage.text;
    const autor = messageFrom.username;
    const fecha = updateMessage.date.toString();

    if (!autor) return ctx.reply('No se pudo obtener el autor');
    if (!fecha) return ctx.reply('No se pudo obtener la fecha');

    const chat = ctx.chat

    if (!chat) return ctx.reply('No se pudo obtener el ID');
    if (chat.type === 'private') return ctx.reply('Este comando solo puede ser utilizado en un grupo');

    const findGroup = await groupController.check(chat.id);
    if (!findGroup) return ctx.reply('El grupo no está registrado. Para agregarlo, envíe el comando /agregarGrupo seguido del valor de la unidad');


    if (!messageText) return ctx.reply('Error al obtener la información');

    const valueInput: string = messageText.replace('/tarea', '').trim();
    if (!valueInput) return ctx.reply('El valor se encuentra vacío');

    const userMenition = valueInput[0].charAt(0)
    if (userMenition != '@') {
        return ctx.reply('Ingrese un usuario válido');
    }

    const valueSplit: String[] = valueInput.split(',')

    const user = valueSplit[0];
    const tarea = valueSplit[1];
    const cantidad = Number(valueSplit[2]);

    if(!chat.title) return ctx.reply('Error al obtener el nombre del grupo');

    const body:BodyTarea = {
        usuario: user.slice(1),
        tarea: tarea,
        grupo: chat.title  ,
        autor: autor,
        cantidad: cantidad.toString(),
        fecha: fecha,
        cct_status: "publish"
    }

    const response = await botController.save(body);
    if(!response) return ctx.reply('Error al intentar guardar el grupo');

    return ctx.reply('¡Registro guardado con éxito!');
}