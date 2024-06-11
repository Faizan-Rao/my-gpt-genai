const { Ollama } = require("@langchain/community/llms/ollama")
const { StringOutputParser } = require("@langchain/core/output_parsers")
const { PromptTemplate  } = require("@langchain/core/prompts")


const model = new Ollama({model : 'llama3', temperature:0.3})

const parser = new StringOutputParser()

const prompt = PromptTemplate.fromTemplate(`
    Act as an assitant and give highly accurate answers on the basis of given question.
    Use proper format for headings, lists and paragraphs.
    {context}
`)

const chain = prompt.pipe(model).pipe(parser)

const streamMessage = async (query, socket) => {
    const stream = await chain.stream({
        context: query
    })
    
    for await(const chunk of stream)
    {
        socket.emit("send:chunk", chunk)
    }
}  

module.exports = streamMessage