const express = require("express")
const io = require("./services/socket")
const app = express()
const http = require('http')





const server = http.createServer(app)

app.use(express.json({
}))
app.use(express.urlencoded({
    extended: true,

}))

app.get("/", (req, res) => {
    console.log("Route Working fine")
})




io.listen(3000)
app.listen(4000, ()=>{
    io.emit("hello")
    console.log(`App is listening at http://localhost:${4000}`)
})