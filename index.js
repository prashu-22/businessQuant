const express = require('express')
const db = require("./database")
const usersRoute = require("./userData")

const app = express()
app.use(express.json());

app.use("/users",usersRoute)

app.listen(3000,()=>{console.log("server running on the port number 3000")})







