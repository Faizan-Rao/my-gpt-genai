import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './context/socketProvider'
import * as marked from 'marked'

import './App.css'
import parser from 'html-react-parser'

interface IChat {
  query: string,
  position: string,
}


const App = () => {

  const [query, setQuery] = useState<string>('')
  const [response, setResponse] = useState<string>('')
  const [messages, setMessage] = useState<IChat[]>([
    {
      query: "hello",
      position: "end"
    },
    {
      query: "Hello, How can i help you?",
      position: "start"
    }
  ])


  const io = useSocket() || null

  const sendQuery = useCallback(async () => {
    if(query.trim() === "")
    {
      return;
    }

    const sendMessage = {
      query: query,
      position: "end",
    }

    messages.push(sendMessage)
    setQuery(``)
    setResponse(``)
    messages.push({
      query: "",
      position: "start",
    })
    console.log(query)
    await io.emit("send:query", {query})

  }, [io, messages, query])

  const handleChunk = useCallback(async (chunk : string) => {
    setResponse(prev => prev += chunk)
    messages[messages.length - 1].query += chunk
  }, [messages])

  const handleChange = (e : any) => setQuery(e.target.value)

  
  useEffect(() => {
      io.on("send:chunk", handleChunk)
      return () => {
        io.off("send:chunk", handleChunk)
      }
  }, [handleChunk, io])

  return (
   <div className='container-fluid min-h-screen relative px-[10%]'>
    <h1 className='text-white font-bold text-2xl  py-1 text-center'>My-GPT</h1>

    <div className="container min-h-[85vh] h-[85vh] overflow-y-auto px-[2%]">
      {
        messages.map((item, index) => {
          return (
            <div className={`chat ${item.position === "start" ? "chat-start" : "chat-end"}`} key={index}>
              <div className={`chat-bubble leading-8 ${item.position === "start" ? "" : "chat-bubble-success"}  text-[white] `}>
                {!item.query && response }
                {parser(marked.parse(item.query))}

              </div>
            </div>
          )
        })
      }
    </div>
    
    <div className="container mx-auto flex gap-4 p-2 ">
      <textarea className="textarea textarea-primary w-full resize-none   focus:outline-none" onChange={handleChange} value={query} rows={1} placeholder="Enter Query"></textarea> 
      <button className="btn btn-active btn-success text-white" onClick={sendQuery}>Send</button>
    </div>
   
   </div>
  )
}

export default App
