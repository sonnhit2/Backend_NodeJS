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

let displayGetCRUD = () =>{
    
}

module.exports = {
    getHomePage:getHomePage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD
}