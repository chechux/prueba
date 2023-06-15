const express = require("express")
const router = express.Router()
const passport = require("passport")
const {isLoggedIn} = require("../lib/auth")

const pool = require("../database")

router.get("/",(req,res)=>{
    res.render("index")
})

router.get("/add",(req,res)=>{
    res.render("links/add")
})

router.post("/add", async (req,res)=>{
    const  {titulo, url, description} = req.body
    const newFoto = {
        titulo,
        url,
        description
    }
    await pool.query("INSERT INTO fotos SET ? ",[newFoto])
    res.redirect("/list")
})

router.get("/list", async (req,res)=>{
    const fotos = await pool.query("SELECT * FROM fotos") //WHERE user_id = ?", [req.user.id])
    res.render("links/list", {fotos})
})


router.get("/delete/:id", async(req,res) =>{
    const {id} = req.params
    await pool.query("DELETE FROM fotos WHERE id = ?", [id] )
    res.redirect("/list")
})

router.get("/edit/:id", async (req,res)=>{
    const {id} = req.params
    const fotos = await pool.query("SELECT * FROM fotos WHERE id = ?", [id])
    res.render("links/edit",{fotos:fotos[0]})
})


router.post("/edit/:id", async (req,res)=>{
    const {id} = req.params
    const {titulo, url, description} = req.body
    const newFoto = {
        titulo,
        url,
        description
    }
    await pool.query("UPDATE fotos SET ? WHERE id = ? ",[newFoto,id])
    res.redirect("/list")
})

router.get("/megusta/:id",async(req,res)=>{
    const {id} = req.params
    await pool.query("UPDATE fotos SET likes = likes +1 WHERE id = ?", id)
    res.redirect("/list")

})

router.get("/nomegusta/:id",async(req,res)=>{
    const {id} = req.params
    await pool.query("UPDATE fotos SET dislikes = dislikes +1 WHERE id = ?", id)
    res.redirect("/list")

})


router.get('/masvotadas', async (req, res) => {
    const fotos = await pool.query('SELECT * FROM fotos ORDER BY likes DESC')
    res.render('megusta', {fotos})
})

router.get("/favoritos/:id",async(req,res)=>{
    const {id} = req.params
    await pool.query ("UPDATE fotos SET favorito = 1 WHERE id = ?", [id])
    res.redirect("/list")
})

router.get("/favoritos",async(req,res)=>{
    const fotos = await pool.query('SELECT * FROM fotos WHERE favorito = 1')
    res.render('favoritos', {fotos})
})


router.get("/signup",(req,res) =>{
    res.render("auth/signup")
})

router.post("/signup", passport.authenticate("local.signup",{
        successRedirect:"/signin",
        failureRedirect:"/signup",
        failureFlash:true
}))







router.get("/signin",(req,res)=>{
    res.render("auth/signin")
})


router.post("/signin",(req,res,next) => {
    passport.authenticate("local.signin",{
        successRedirect:"/profile",
        failureRedirect:"/signin",
        successFlash:true
    })(req,res,next)
})




router.get("/profile",(req,res)=>{
    res.render("profile")
})

router.get("/logout", (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});



module.exports = router