import db from "../models/index";
import bcrypt from 'bcryptjs';

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

module.exports = {
    handleUserLogin:handleUserLogin,
    getAllUsers: getAllUsers
}