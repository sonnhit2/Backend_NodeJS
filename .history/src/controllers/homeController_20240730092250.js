import db from '../models/index';

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

let postCRUD = (req,res)=>{
    console.log(req.body);
    return res.send("Post crud from server");
}

module.exports = {
    getHomePage:getHomePage,
    getCRUD:getCRUD,
    postCRUD:postCRUD
}