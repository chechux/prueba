const passport = require("passport")
const localStrategy = require("passport-local").Strategy

const pool  = require("../database")

passport.use("local.signin", new localStrategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback: true
}, async ( req,username,password,done)=>{
    
    const rows = await pool.query("SELECT * FROM users WHERE username = ?",[username])
    if(rows.length > 0 ) {
        const user = rows[0]
        if (user.password === password){
            done(null,user,req.flash("success", "welcome" + user.username))
        }else{
            done(null, false, req.flash("message", "contra incorrecta"))
        }
    }else{
        return done(null, false, req.flash("message", "el ususario no existe"))
    }

}))

passport.use("local.signup", new localStrategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback: true
}, async (req, username, password, done) =>{

    const newUser = {
        username,
        password
    }

    const result = await pool.query("INSERT INTO users SET ?", [newUser])
    newUser.id = result.insertId
    return done(null, newUser)
}))

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id])
    done(null, rows[0])

})