const { Server } = require('socket.io')
const streamMessage = require("./genAi")
const io = new Server({
    cors : {
        allowedHeaders: "*",
        origin: "*"
    }
})

io.on('connection', (socket) => {
    console.log("Connection Successful", socket.id)
    
    socket.on("send:query", ({query}) => {
        streamMessage(query, socket)
    })
})

module.exports = io