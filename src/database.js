const mysql = require("mysql")
const {promisify} = require("util")

const {database} = require("./keys")

const pool = mysql.createPool(database)

pool.getConnection((err,connection)=>{
    if(err) {
        if (err.code === "ECONNREFUSED"){
            console.error("conexion rechazada")
        }
    }

    if(connection) connection.release()
    console.log("base de datos conectada")
})

pool.query = promisify(pool.query) //para poder hacer promesas

module.exports = pool