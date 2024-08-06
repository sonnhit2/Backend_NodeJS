import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password)=>{
    return new Promise( async (resolve, reject) => {
        try {
            let userData ={};

            let isExist = await checkUserEmail(email);
            if(isExist){
                //user already eixst
                let user = await db.User.findOne({
                    //attributes:['email', 'password', 'roleId'], // chi lay ra 01 so truong
                    where: {email: email},
                    raw: true
                });
                if(user){
                    //compare password
                    let check = bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode=0;
                        userData.message = 'Ok';
                        delete user.password; //khong show truong password, nhớ gán raw:true
                        userData.user = user;
                    }
                    else{
                        userData.errCode = 3;
                        userData.message = "Wrong password";
                    }
                }else{
                    userData.errCode = 2,
                    userData.message = `User is not found`;
                }
            }
            else{
                //return error
                userData.errCode=1;
                userData.message = `Your's Email isn't exist in your system. Plz try other email!`;
            }
            resolve(userData);

        } catch (e) {
            reject(e);            
        }
    });
}

let checkUserEmail = (userEmail) => {
    return new Promise( async (resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            });
            if(user){
                resolve(true);
            }
            else{
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllUsers = (userId) =>{
    return new Promise( async (resolve, reject)=>{
        try {
            let users = '';
            if(userId==='ALL'){
                users= await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                });
            }
            if(userId && userId!=='ALL'){
                users= await db.User.findOne({
                    where: {id: userId},
                    attributes:{
                        exclude: ['password']
                    }
                });
            }

            console.log(users);
            
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
}

let createNewUser = (data) =>{
    return new Promise ( async (resolve, reject)=>{
        try {

            //check email existed?
            let check = await checkUserEmail(data.email);
            if(check===true){
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is existed. Please try another email'
                });                
            }

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

            resolve({
                errCode: 0,
                message: "Ok"
            });
        } catch (e) {
            reject(e);
        }

    });
}

let deleteUser = (userId) => {
    return new Promise (async (resolve, reject)=>{
        let user = await db.User.findOne({
            where: {id: userId}
        });
        if(!user){
            resolve({
                errCode: 2,
                errMessage: `The user isn't existed`
            });                
        }

        //cach 1:
        // if(user){
        //     await user.destroy(); //muon goi duoc thi bo khai bao   "query":{"raw": true } trong /src/config/config.js
        // }

        //cach 2: xoa truc tiep db ko thong qua nodejs
        await db.User.destroy({
            where: {id: userId}
        });

        resolve({
            errCode: 0,
            message: `The user is deleted`
        });                


    });
}

let updateUserData=(data)=>{
    return new Promise(async (resolve, reject) =>{
        try{
            if(!data.id){
                resolve({
                    errCode: 2, errMessage: `Missing required parameters`
                });

            }

            //tim user de chinh sua
            let user = await db.User.findOne({
                where: { id: data.id }, 
                raw:false //khong co no se bi loi ham user.save()
            })
            //neu user duoc tim thay thi thuc hien cap nhat 
            //thong tin cua user theo bien data truyen vao
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();


                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address : data.address
                // }),{where: {id: data.id}};

                resolve({
                    errCode: 0, message: `Update user succeed!`
                });
            }
            else{
                resolve({
                    errCode: 1, errMessage: `User's not found!`
                });
            }
        }catch(e){
            console.log(e);
        }
    });
    
}

module.exports = {
    handleUserLogin:handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}