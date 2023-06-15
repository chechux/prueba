const express = require("express")
const morgan = require("morgan")
const {engine} = require("express-handlebars")
const path = require("path")
const passport = require("passport")
const session = require("express-session")
const flash= require("connect-flash")
//const mysqlStore = require("express-mysql-session")

//const {database} = require("./keys")


const app = express()
require("./lib/passport")


app.set("port", process.env.PORT || 3000)
app.set("views" ,path.join(__dirname,"views"))

app.engine(".hbs", engine({
    defaultLayout: "main",
    layoutsDir:path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
}))


app.set("view engine" ,".hbs")


app.use(session({
    secret:"fazt",
    resave: false,
    saveUninitialized: false,
    // store: new mysqlStore(database)
}))

app.use(flash())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next)=>{
    app.locals.success = req.flash("success")
    app.locals.message = req.flash("message")
    app.locals.user = req.user
    next();
})



app.use(require("./routes/index"))




app.use(express.static(path.join(__dirname, "public")))


app.listen(app.get("port"), ()=>{
    console.log("listening")
} )