import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender==='1'?true:false,
                roleId: data.roleId
            });

            resolve("Create user successfull !");
        } catch (e) {
            reject(e);
        }    
    })
}

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(e){
            reject(e);
        }
    })
}

let getAllUser = ()=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let users = db.User.findAll({
                raw: true,
            });           
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById=(userId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({ 
                where: { id: userId },
                raw:true,
            });

            if(user){
                resolve(user);
            }
            else{
                resolve({});
            }

        } catch (e) {
            reject(e);            
        }
    })
}

let updateUserData=(data)=>{
    return new Promise(async (resove, reject) =>{
        try{
            //tim user de chinh sua
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            //neu user duoc tim thay thi thuc hien cap nhat 
            //thong tin cua user theo bien data truyen vao
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                //thực hiện trả về danh sách users
                let allUsers = await db.User.findAll();

                resove(allUsers);
            }
            else{
                resove();
            }
        }catch(e){
            console.log(e);
        }
    });
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser:getAllUser,
    getUserInfoById:getUserInfoById,
    updateUserData:updateUserData
}