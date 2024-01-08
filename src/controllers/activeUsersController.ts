import ActiveUsers from "../models/ActiveUsers";
import { IActiveUsers } from "../models/ActiveUsers";

interface CreateActiveUsers {
    idUser: number;
    idGroup: number;
}

async function create({idUser,idGroup}: CreateActiveUsers):Promise<boolean> {
    try {
        await ActiveUsers.create({idUser,idGroup})
        return true
    } catch (error) {

        console.log(error)
        return false
    }
}


async function update(idUser:number,idGroup:number):Promise<boolean> {
    try {
        await ActiveUsers.updateOne({idUser:idUser}, { $set: { idGroup: idGroup } })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

async function updateStatus(idUser:number,optionName:string, optionValue:number):Promise<boolean>{
    try {
        await ActiveUsers.updateOne({idUser:idUser}, { $set: { optionName: optionName, optionValue:optionValue, activeUser:true } })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


async function check(idUser:number):Promise<boolean>{
    try {
        const activesResponse = await ActiveUsers.find({idUser:idUser})
        return activesResponse.length > 0
    } catch (error) {
        console.log(error)
        return false
    }
}

async function checkIfActive(idUser:number){
    try {
        const activesResponse = await ActiveUsers.findOne({idUser:idUser}).where('activeUser').equals(true).lean()
        return !!activesResponse
    } catch (error) {
        console.log(error)
        return false
    }
}

async function find(idUser:number):Promise<IActiveUsers| null>{
    try {
        const activesResponse = await ActiveUsers.findOne({idUser:idUser}).lean();
        return activesResponse  || null;
    } catch (error) {
        console.log(error)
        return null
    }
}


async function endStatus(idUser:number){
    await ActiveUsers.updateOne({idUser:idUser}, { $set: { optionName: null, optionValue:null, activeUser:false} })
}


async function checkAllActives(){
    const activesResponse = await ActiveUsers.find({}).where('activeUser').equals(true).lean();
    return activesResponse
}

const activeUserController = {
    create,
    update,
    updateStatus,
    check,
    checkIfActive,
    find,
    endStatus,
    checkAllActives
}

export default activeUserController