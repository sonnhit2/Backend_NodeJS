import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode:1,
            message: 'Missing input parameters!',
        });
    }

    let userData = await userService.handleUserLogin(email,password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) =>{
    let id = req.body.id; //ALL: lấy tất cả người dùng; id: 
    if(!id){
        return res.status(200).json({
            errCode:1,
            errMessage: 'Missing required parameters',
            user:[]
        });
    }

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0, errMessage: 'OK', users
    });
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers
}