import Group from "../models/Groups"
import { IGroups } from "../models/Groups";

async function check(id:number):Promise<boolean>{
    const result = await Group.find({id:id});
    console.log(result)
    return result.length !== 0;
}

async function create(body:IGroups):Promise<void> {
    await Group.create(body);
}

async function getValor(id:number){
    const response = await Group.findOne({id:id}).select({value: 1,title:1 }).lean();
    if(!response) return {}
    const {value, title} = response;
    return {
        value, title
    }
}

const groupController = {
    check,
    create,
    getValor
}

export default groupController