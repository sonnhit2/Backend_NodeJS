import db from '../models/index';
import CRUDService from "../services/CRUDService";

let getHomePage = async(req, res)=>{
    try {
        let data = await db.User.findAll();  //db.user : kết nối trực tiếp đến bảng user
        return res.render("homepage.ejs",{
            data: JSON.stringify(data)
        });            
    } catch (e) {
        console.log(e);
    }    
}

let getCRUD = (req,res)=>{
    return res.render("crud.ejs");
}

let postCRUD = async(req,res)=>{
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("Post crud from server");
}

let displayGetCRUD = async (req, res) =>{
    let data = await CRUDService.getAllUser();
    console.log('--------------------------------------');
    console.log(data);
    console.log('--------------------------------------');
    return res.render("displayCRUD.ejs",{
        dataTable: data
    });
}

let getEditCRUD = async (req,res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserInfoById(userId);
        //check user data not found

        return res.render('editCRUD.ejs',{
            user:userData
        });
    }
    else{
        return res.send('User is not found!');
    }
}

let putCRUD = async(req,res)=>{
    let data=req.body;
    return res.send("Put crud from server");
}


module.exports = {
    getHomePage:getHomePage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD,
    getEditCRUD:getEditCRUD,
    putCRUD:putCRUD
}