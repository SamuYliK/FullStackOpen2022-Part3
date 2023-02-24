const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as third argument. If you want to add person, then name is fourth argument and number fifth argument.')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://samuylikuivila:${password}@cluster0.xenfxwd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    }) 
} else if (process.argv.length === 3){
    console.log('phonebook')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    console.log('Please give password as third argument. If you want to add persons, name is fourth argument and number is fifth. No other arguments can be given.')
    mongoose.connection.close()
}


/*
const note = new Note({
  content: 'Who are you Mr. Mongoose?',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

*/
/*
Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
*/