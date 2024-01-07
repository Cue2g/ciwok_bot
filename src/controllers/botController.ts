
import { IActiveUsers } from "../models/ActiveUsers";
import { ContextFix } from "../../app";
import groupController from "./groupsControllers";
import usersController from "./usersController";
import bot from "../../app";
interface ListService {
	name: string,
	valor: number
}

interface ResponseItem {
    text: string;
    callback_data: string;
}

interface bodyTarea {
	usuario: string;
	tarea: String;
	grupo: String;
	autor: string;
	cantidad: String;
	fecha: string
	cct_status: string
}

const listServices = [
    {
        "name": "Post Diseñado",
        "valor": 1
    },
    {
        "name": "Post Ilustrado",
        "valor": 3
    },
    {
        "name": "Edición simple",
        "valor": 0.8
    },
    {
        "name": "Edición con montaje",
        "valor": 1
    },
    {
        "name": "Edición con diseño",
        "valor": 1
    },
    {
        "name": "Video edición simple",
        "valor": 2.5
    },
    {
        "name": "Video animado",
        "valor": 3
    },
    {
        "name": "Video animado Ilustrado",
        "valor": 5
    },
    {
        "name": "Reel edición simple",
        "valor": 1
    },
    {
        "name": "Reel edición compleja",
        "valor": 2
    },
    {
        "name": "Carrusel diseño (por pieza)",
        "valor": 0.5
    },
    {
        "name": "Carrusel fotos editadas (por pieza)",
        "valor": 0.25
    },
    {
        "name": "Storie",
        "valor": 0.5
    },
    {
        "name": "Gif",
        "valor": 1.5
    },
    {
        "name": "Sesion de Fotos",
        "valor": 10
    }
]



function orderListMessage(array: ListService[], colum: number): ResponseItem[][] {
    const response: ResponseItem[] = array.map(val => ({
        text: val.name,
        callback_data: val.name,
    }));

    const arrayR: ResponseItem[][] = [];
    response.forEach((res) => {
        if (arrayR.length === 0) {
            arrayR.push([res]);
        } else {
            if (arrayR[arrayR.length - 1].length < colum) {
                arrayR[arrayR.length - 1].push(res);
            } else {
                arrayR.push([res]);
            }
        }
    });

    return arrayR;
}

function getServices() {
    return orderListMessage(listServices, 2)
}


async function saveTask(responseText: string, data: IActiveUsers, ctx: ContextFix): Promise<boolean> {
    try {


        const splitText = splitFunc(responseText);
        const userMenition = splitText[0].charAt(0)
        const amountInput = Number(splitText[1])
        const TaskToUser = splitText[0].slice(1)
        if (userMenition != '@') {
            ctx.reply('ingrese un usuario valido')
            return false
        }

        if (!amountInput) {
            ctx.reply('Cantidad no ingresada')
            return false
        }

        if (isNaN(amountInput)) {
            ctx.reply('El formato de la cantidad no es un numero')
            return false
        }

        const groupValue = await groupController.getValor(data.idGroup);
        if (!groupValue?.value) {
            ctx.reply('error al capturar el valor del grupo, por favor inicie el proceso nuevamente.');
            return false
        }

        let valorTotal: number = 0;

        if (data.optionName === 'Sesion de Fotos') {
            valorTotal = 10 * amountInput
        } else {
            if(!data.optionValue) throw new Error('Option Value null')
            const result = amountInput * data.optionValue;
            valorTotal = groupValue.value * result
        }
        const user = await usersController.getUserName(data.idUser)
        const body = {
            usuario: TaskToUser,
            tarea: data.optionName,
            grupo: groupValue.title,
            autor: user?.name,
            cantidad: amountInput.toString(),
            monto: valorTotal.toFixed(2),
            fecha: ctx.update.message ? ctx.update.message.date.toString() : Date.now() ,
            cct_status: "publish",
            tipo_de_pago: "tarea"
        }


        console.log('here datasend')
        const response = await dataSend(body)

        if (!response) {
            ctx.reply('Erro al enviar la data')
            return false
        }
        console.log('here3123123')
        bot.telegram.sendMessage(data.idGroup, `@${user?.userName} creo una tarea de:
${data.optionName}
Fue asignada a @${TaskToUser}
cantidad:${body.cantidad} `)

        ctx.reply(`Registro Guardado con Exito!`)

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


function splitFunc(ctxText: string) {
    const responseText = ctxText;
    const resultArray = responseText.split(',')
    return resultArray
}

async function dataSend(body: any) {
    try {

        console.log(body)
        console.log(process.env.CLIENT_TOKEN)
        const response = await fetch('https://scc.ciwok.com/wp-json/jet-cct/comisiones_dec', {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.CLIENT_TOKEN }
        })

        if (response.status != 200) {
            console.log(response.json)
            const dataResponse = await response.json();
            console.log(dataResponse)
            throw new Error('error al enviar la data')
        }
        const dataResponse = await response.json();

        return dataResponse
    } catch (error) {
        console.log(error)
        return null
    }

}

async function save(body: bodyTarea) {
    return dataSend(body)
}

const botController = {
    save,
    getServices,
    listServices,
    saveTask
}

export default botController