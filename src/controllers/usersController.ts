import Users from "../models/Users"
import { IUsers} from "../models/Users"

async function create(body:IUsers){
    await Users.create(body);
    console.log('user created:' + body)
}

async function check(id:number){
    const userCheck = await Users.findOne({id:id}).select({id:1}).lean();
    return !!userCheck
}

async function checkGroupUser(id:number, idGroup:number){
    const userCheck = await Users.findOne({id:id}).where('idGroup').equals(idGroup)
    return userCheck
}

async function getUserName(id: number): Promise<{ userName: string; name: string } | null> {
    try {
        const userResponse = await Users.findOne({ id }).select({ userName: 1, name: 1 }).lean();
        return userResponse
            ? { userName: userResponse.userName, name: userResponse.name }
            : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}



const usersController = {
    create,
    check,
    checkGroupUser,
    getUserName
}

export default usersController