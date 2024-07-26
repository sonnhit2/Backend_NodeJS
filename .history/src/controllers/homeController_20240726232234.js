import db from '../models/index';

let getHomePage = async(req, res)=>{
    try {
        let data = await db.Users.findAll();  //db.user : kết nối trực tiếp đến bảng user

        return res.render("homepage.ejs");            
    } catch (e) {
        console.log(e);
    }    
}

module.exports = {
    getHomePage:getHomePage,
}