import React, { Children, createContext, useContext, useEffect,  useMemo } from 'react'
import * as io from 'socket.io-client'

interface ISocketProvider {
    children : React.ReactElement
}
const SocketConnection = io.connect("http://localhost:3000")

const socketContext = createContext(null)


export const useSocket = () => {
    const state = useContext(socketContext)
    return state
}

const SocketProvider = ({
    children 
    } : ISocketProvider) => {
            
   
    const io = useMemo(()=> SocketConnection, [])
    

    return (
        <socketContext.Provider value={io}>
            {children}
        </socketContext.Provider>
    )
}

export default SocketProvider