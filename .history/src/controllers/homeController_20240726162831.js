let getHomePage = (req, res)=>{
    //return res.send("Hello world from controller");
    return res.render("homepage.ejs");
}

module.exports = {
    getHomePage:getHomePage,
}