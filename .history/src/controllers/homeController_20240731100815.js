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
    //hứng dữ liệu được trả về từ client
    let data=req.body;
    //Thực hiện cập nhât thay đổi qua service va 
    //nhận kết quả trả về từ service là 01 danh sach user  
    let allUsers = await CRUDService.updateUserData(data);
    //hiển thị kết quả danh sách user qua view
    return res.render('displayCRUD.ejs',{
        dataTable:allUsers
    })
}

let deleteCRUD = async (req, res)=>{
    //xác định id của user cần xoá được gửi từ query của client
    let id= req.query.id;
    await CRUDService.deleteUserById(id);
}

module.exports = {
    getHomePage:getHomePage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD,
    getEditCRUD:getEditCRUD,
    putCRUD:putCRUD,
    deleteCRUD:deleteCRUD
}