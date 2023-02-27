const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                if ( /^\d{3}-\d{5,}$/.test(v) ) {
                    return true
                } else if ( /^\d{2}-\d{6,}$/.test(v) ){
                    return true
                }
                return false
            },
            message: "Number length is min. 8 characters. Two parts separated with '-'. First part includes 2 or 3 numbers. Example 040-1234567",
        }, 
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)