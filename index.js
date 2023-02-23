const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-1234566"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

morgan.token('postBody', (request) => {
    return JSON.stringify(request.body)
})

app.get('/', morgan('tiny'), (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', morgan('tiny'), (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', morgan('tiny'), (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :postBody'), (request, response) => {
    const body = request.body
    if (!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    if(persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())){
        return response.status(400).json({
            error: 'This name is already in phonebook'
        })
    }
    const person = {
        id: Math.floor(Math.random()*10000000),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', morgan('tiny'), (request, response) => {
    const fullDate = new Date().toString()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${fullDate}</p>`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

